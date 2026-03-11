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

module.exports = { supabase, usersDB, postsDB, commentsDB };
