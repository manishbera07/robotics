import { createClient } from '@/lib/supabase/client'

export type UserRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Legend'

export interface UserStats {
  userId: string
  email: string
  totalGamesPlayed: number
  highestScore: number
  averageScore: number
  totalXP: number
  rank: UserRank
  achievements: number
  eventsAttended: number
}

export interface GameStats {
  gameName: string
  totalPlays: number
  highestScore: number
  averageScore: number
  lowestScore: number
  totalTimePlayed: number // milliseconds
  bestTime?: number // fastest completion for timed games
}

export interface WeeklyStats {
  gameName: string
  score: number
  playedAt: string
  userId: string
  email: string
}

// Calculate user rank based on XP/activity
export function calculateRank(xp: number): UserRank {
  if (xp >= 5000) return 'Legend'
  if (xp >= 3000) return 'Platinum'
  if (xp >= 1500) return 'Gold'
  if (xp >= 500) return 'Silver'
  return 'Bronze'
}

// Calculate XP from game score
export function calculateXPFromScore(score: number, maxPossibleScore: number = 200): number {
  const percentage = Math.min((score / maxPossibleScore) * 100, 100)
  return Math.ceil((percentage / 100) * 100)
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const supabase = createClient()

    // Get game scores
    const { data: gameScores, error: scoresError } = await supabase
      .from('game_scores')
      .select('score')
      .eq('user_id', userId)

    if (scoresError) {
      console.error('Error fetching game scores:', scoresError)
      throw scoresError
    }

    // Get event registrations
    const { data: eventRegs, error: eventsError } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('user_id', userId)

    if (eventsError && eventsError.code !== 'PGRST116') {
      console.error('Error fetching events:', eventsError)
    }

    // Get achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)

    if (achievementsError && achievementsError.code !== 'PGRST116') {
      console.error('Error fetching achievements:', achievementsError)
    }

    // Get user email - try to get current user first
    let email = 'Unknown'
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (currentUser && currentUser.id === userId) {
      email = currentUser.email || 'Unknown'
    } else {
      // For other users, we need to query from a users metadata table or use a placeholder
      // Since we don't have admin access, we'll use a placeholder for now
      email = `User ${userId.substring(0, 8)}`
    }

    const scores = gameScores || []
    const totalXP = scores.reduce((sum, s) => sum + calculateXPFromScore(s.score), 0)

    return {
      userId,
      email,
      totalGamesPlayed: scores.length,
      highestScore: scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0,
      averageScore: scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0,
      totalXP,
      rank: calculateRank(totalXP),
      achievements: achievements?.length || 0,
      eventsAttended: eventRegs?.length || 0,
    }
  } catch (err: any) {
    if (err?.message || err?.code) {
      console.error('Error fetching user stats:', err)
    }
    return null
  }
}

export async function getGameStats(gameName: string, userId?: string): Promise<GameStats | null> {
  try {
    const supabase = createClient()

    let query = supabase
      .from('game_scores')
      .select('score, time_taken')
      .eq('game_name', gameName)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) {
      // Quietly handle errors; avoid client-side logging
      return null
    }
    
    if (!data || data.length === 0) {
      // No scores yet - this is normal, not an error
      return null
    }

    const scores = data.map(d => d.score).filter(s => s != null)
    const times = data.map(d => d.time_taken).filter(t => t !== null && t !== undefined)

    if (scores.length === 0) return null

    return {
      gameName,
      totalPlays: data.length,
      highestScore: Math.max(...scores),
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      lowestScore: Math.min(...scores),
      totalTimePlayed: times.reduce((a, b) => a + (b || 0), 0),
      bestTime: times.length > 0 ? Math.min(...times.filter(t => t > 0)) : undefined,
    }
  } catch (err: any) {
    // Quietly handle exceptions; avoid client-side logging
    return null
  }
}

export async function getWeeklyLeaderboard(gameName: string): Promise<WeeklyStats[]> {
  try {
    const supabase = createClient()
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('game_scores')
      .select('score, completed_at, user_id')
      .eq('game_name', gameName)
      .gte('completed_at', weekAgo)
      .order('score', { ascending: false })
      .limit(10)

    if (error) throw error
    if (!data) return []

    // Fetch user emails in parallel
    const userIds = [...new Set(data.map(d => d.user_id))]
    const { data: users } = await supabase
      .from('auth.users')
      .select('id, email')
      .in('id', userIds)
      .catch(() => ({ data: [] }))

    const userMap: Record<string, string> = {}
    users?.forEach((u: any) => {
      userMap[u.id] = u.email
    })

    return data.map(d => ({
      gameName,
      score: d.score,
      playedAt: d.completed_at,
      userId: d.user_id,
      email: userMap[d.user_id] || 'Anonymous',
    }))
  } catch (err: any) {
    // Quietly handle exceptions; avoid client-side logging
    return []
  }
}

export async function getAllUserStats(): Promise<UserStats[]> {
  try {
    const supabase = createClient()

    // Get all unique users who have played games
    const { data: gameScores, error: scoresError } = await supabase
      .from('game_scores')
      .select('user_id')

    if (scoresError) throw scoresError

    const userIds = [...new Set((gameScores || []).map(s => s.user_id))]

    // Fetch stats for all users in parallel
    const stats = await Promise.all(
      userIds.map(userId => getUserStats(userId))
    )

    return stats.filter((s): s is UserStats => s !== null)
      .sort((a, b) => b.totalXP - a.totalXP)
  } catch (err: any) {
    if (err?.message || err?.code) {
      console.error('Error fetching all user stats:', err)
    }
    return []
  }
}

export async function getAchievements(userId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        id,
        unlocked_at,
        achievement_id,
        achievements (
          name,
          description,
          badge_icon,
          category
        )
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err: any) {
    if (err?.message || err?.code) {
      console.error('Error fetching achievements:', err)
    }
    return []
  }
}

export async function unlockAchievement(userId: string, achievementName: string) {
  try {
    const supabase = createClient()

    // Get achievement ID
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .select('id')
      .eq('name', achievementName)
      .single()

    if (achievementError) throw achievementError

    // Add user achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
      })
      .select()

    if (error) {
      // Achievement might already be unlocked
      if (error.code !== '23505') {
        throw error
      }
    }

    return data?.[0] || null
  } catch (err: any) {
    if (err?.message || err?.code) {
      console.error('Error unlocking achievement:', err)
    }
  }
}

// Get individual game scores for a user
export async function getUserGameScores(userId: string, gameName?: string) {
  try {
    const supabase = createClient()

    let query = supabase
      .from('game_scores')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (gameName) {
      query = query.eq('game_name', gameName)
    }

    const { data, error } = await query

    if (error) {
      // Quietly handle query errors
      return []
    }
    return data || []
  } catch (_err: any) {
    // Quietly handle exceptions
    return []
  }
}

// Get user's position in overall leaderboard
export async function getUserLeaderboardPosition(userId: string): Promise<{
  position: number
  totalPlayers: number
  percentile: number
} | null> {
  try {
    const allStats = await getAllUserStats()
    const userIndex = allStats.findIndex(s => s.userId === userId)
    
    if (userIndex === -1) return null

    return {
      position: userIndex + 1,
      totalPlayers: allStats.length,
      percentile: Math.round(((allStats.length - userIndex) / allStats.length) * 100)
    }
  } catch (err: any) {
    if (err?.message || err?.code) {
      console.error('Error getting leaderboard position:', err)
    }
    return null
  }
}

// Get user's position in a specific game leaderboard
export async function getUserGameLeaderboardPosition(userId: string, gameName: string): Promise<{
  position: number
  totalPlayers: number
  highScore: number
} | null> {
  try {
    const supabase = createClient()

    // Get all unique user scores for this game
    const { data, error } = await supabase
      .from('game_scores')
      .select('user_id, score')
      .eq('game_name', gameName)
      .order('score', { ascending: false })

    if (error) throw error
    if (!data) return null

    // Get highest score per user
    const userHighScores: Record<string, number> = {}
    data.forEach(entry => {
      if (!userHighScores[entry.user_id] || userHighScores[entry.user_id] < entry.score) {
        userHighScores[entry.user_id] = entry.score
      }
    })

    // Sort by score
    const sortedUsers = Object.entries(userHighScores)
      .sort(([, a], [, b]) => b - a)

    const userIndex = sortedUsers.findIndex(([uid]) => uid === userId)
    
    if (userIndex === -1) return null

    return {
      position: userIndex + 1,
      totalPlayers: sortedUsers.length,
      highScore: sortedUsers[userIndex][1]
    }
  } catch (err: any) {
    if (err?.message || err?.code) {
      console.error('Error getting game leaderboard position:', err)
    }
    return null
  }
}
