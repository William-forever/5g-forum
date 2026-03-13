/**
 * ========================================
 * Supabase 客户端配置
 * ========================================
 * @description 连接 Supabase 数据库
 * @date 2026-03-10
 * @version 1.0.0
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dhqoebqzmuktgxpuktyv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocW9lYnF6bXVrdGd4cHVrdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTM5MDAsImV4cCI6MjA4ODc2OTkwMH0.aiLsQyrLSgs0SSV3aDh8wiIkT_kqf-DXRwV9M8UoLfg';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 用户相关操作
 */
const usersDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async findByUsername(username) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(user) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

/**
 * 帖子相关操作
 */
const postsDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findByCategory(category) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(post) {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async getPage(page = 1, limit = 10, category = null) {
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await query.range(start, end);
    if (error) throw error;

    return {
      posts: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  },

  async incrementViews(id) {
    const { data: post } = await supabase
      .from('posts')
      .select('views')
      .eq('id', id)
      .single();
    
    const { data, error } = await supabase
      .from('posts')
      .update({ views: (post?.views || 0) + 1 })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async incrementLikes(id) {
    const { data: post } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', id)
      .single();
    
    const { data, error } = await supabase
      .from('posts')
      .update({ likes: (post?.likes || 0) + 1 })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

/**
 * 评论相关操作
 */
const commentsDB = {
  async getByPostId(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(comment) {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};

/**
 * 点赞相关操作
 */
const likesDB = {
  async create(like) {
    const { data, error } = await supabase
      .from('likes')
      .insert([like])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(userId, targetId, targetType) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('target_id', targetId)
      .eq('target_type', targetType);
    if (error) throw error;
    return true;
  },

  async exists(userId, targetId, targetType) {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('target_id', targetId)
      .eq('target_type', targetType)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  async getPostLikes(postId) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('target_id', postId)
      .eq('target_type', 1);
    if (error) throw error;
    return data || [];
  },

  async getCommentLikes(commentId) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('target_id', commentId)
      .eq('target_type', 2);
    if (error) throw error;
    return data || [];
  },

  async getUserLikes(userId) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  }
};

/**
 * 收藏相关操作
 */
const collectionsDB = {
  async create(collection) {
    const { data, error } = await supabase
      .from('collections')
      .insert([collection])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(userId, postId) {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
    if (error) throw error;
    return true;
  },

  async exists(userId, postId) {
    const { data, error } = await supabase
      .from('collections')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  async getPostCollections(postId) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('post_id', postId);
    if (error) throw error;
    return data || [];
  },

  async getUserCollections(userId) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

/**
 * 积分日志相关操作
 */
const pointsLogDB = {
  async create(log) {
    const { data, error } = await supabase
      .from('points_log')
      .insert([log])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUserLogs(userId, limit = 20) {
    const { data, error } = await supabase
      .from('points_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async getTodayLogs(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('points_log')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

/**
 * 积分相关操作
 */
const pointsDB = {
  async calculateUserPoints(userId) {
    try {
      // 获取用户的所有帖子
      const { data: userPosts, error: postsError } = await supabase
        .from('posts')
        .select('id, likes, comments, collect_count')
        .eq('author_id', userId);
      
      if (postsError) throw postsError;
      
      // 获取用户的所有评论
      const { data: userComments, error: commentsError } = await supabase
        .from('comments')
        .select('id')
        .eq('author_id', userId);
      
      if (commentsError) throw commentsError;
      
      // 获取用户的所有点赞
      const { data: userLikes, error: likesError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId);
      
      if (likesError) throw likesError;
      
      // 获取用户的所有收藏
      const { data: userCollections, error: collectionsError } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', userId);
      
      if (collectionsError) throw collectionsError;
      
      // 计算积分
      let totalPoints = 0;
      
      // 1. 发帖积分：每个帖子 +10分
      totalPoints += (userPosts?.length || 0) * 10;
      
      // 2. 被点赞积分：帖子被点赞一次 +2分
      const postLikesTotal = userPosts?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;
      totalPoints += postLikesTotal * 2;
      
      // 3. 被收藏积分：帖子被收藏一次 +2分
      const postCollectionsTotal = userPosts?.reduce((sum, post) => sum + (post.collect_count || 0), 0) || 0;
      totalPoints += postCollectionsTotal * 2;
      
      // 4. 评论积分：每个评论 +1分
      totalPoints += (userComments?.length || 0) * 1;
      
      // 5. 点赞他人积分：每个点赞 +0.5分（鼓励互动）
      totalPoints += (userLikes?.length || 0) * 0.5;
      
      // 6. 收藏他人积分：每个收藏 +0.5分（鼓励收藏好内容）
      totalPoints += (userCollections?.length || 0) * 0.5;
      
      return Math.floor(totalPoints);
    } catch (error) {
      console.error('计算用户积分失败:', error);
      throw error;
    }
  },

  async updateUserPoints(userId) {
    try {
      const points = await this.calculateUserPoints(userId);
      
      // 获取用户当前积分
      const { data: currentUser, error: fetchError } = await supabase
        .from('users')
        .select('points')
        .eq('id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      const currentPoints = currentUser?.points || 0;
      const pointsChange = points - currentPoints;
      
      // 更新用户积分
      const { data, error } = await supabase
        .from('users')
        .update({ points })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // 记录积分变动日志（如果有变化）
      if (pointsChange !== 0) {
        try {
          await pointsLogDB.create({
            user_id: userId,
            points_change: pointsChange,
            total_points: points,
            reason: '系统自动更新积分',
            created_at: new Date().toISOString()
          });
        } catch (logError) {
          console.error('记录积分日志失败:', logError);
          // 不抛出错误，继续执行
        }
      }
      
      return { 
        ...data, 
        calculated_points: points,
        previous_points: currentPoints,
        points_change: pointsChange
      };
    } catch (error) {
      console.error('更新用户积分失败:', error);
      throw error;
    }
  },

  async getTopUsers(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, points, avatar')
        .order('points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('获取排行榜失败:', error);
      throw error;
    }
  },

  async updateAllUsersPoints() {
    try {
      // 获取所有用户
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id');
      
      if (usersError) throw usersError;
      
      const results = [];
      
      // 批量更新每个用户的积分
      for (const user of users) {
        try {
          const updatedUser = await this.updateUserPoints(user.id);
          results.push(updatedUser);
        } catch (err) {
          console.error(`更新用户 ${user.id} 积分失败:`, err);
        }
      }
      
      // 重新获取排行榜
      const topUsers = await this.getTopUsers(10);
      
      return {
        success: true,
        message: `已更新 ${results.length} 位用户的积分`,
        topUsers
      };
    } catch (error) {
      console.error('批量更新用户积分失败:', error);
      throw error;
    }
  }
};

module.exports = { 
  supabase, 
  usersDB, 
  postsDB, 
  commentsDB, 
  likesDB, 
  collectionsDB,
  pointsLogDB,
  pointsDB 
};
