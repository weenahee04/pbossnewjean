-- ============================================
-- Jespark Rewards & Lifestyle Database Schema
-- Database: PostgreSQL 14+
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    tier VARCHAR(50) DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    member_since INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    name_en VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. BRANDS TABLE
-- ============================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    website VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. REWARDS TABLE
-- ============================================
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    points INTEGER NOT NULL CHECK (points > 0),
    image TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    stock_quantity INTEGER DEFAULT -1, -- -1 means unlimited
    is_popular BOOLEAN DEFAULT false,
    is_limited BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    terms_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. REWARD_REDEMPTIONS TABLE
-- ============================================
CREATE TABLE reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    points_used INTEGER NOT NULL,
    coupon_code VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'expired')),
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- ============================================
-- 6. DEALS TABLE
-- ============================================
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    image TEXT NOT NULL,
    tag VARCHAR(50),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    points_multiplier DECIMAL(3,2) DEFAULT 1.00,
    discount_percentage INTEGER,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    terms_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. COUPONS TABLE
-- ============================================
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    discount VARCHAR(50) NOT NULL, -- e.g., "20% OFF", "$5.00 Off"
    image TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    terms_conditions TEXT
);

-- ============================================
-- 8. BANNERS TABLE
-- ============================================
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    image TEXT NOT NULL,
    button_text VARCHAR(100),
    link VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. STORES TABLE
-- ============================================
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    hours VARCHAR(255), -- e.g., "10:00 - 22:00"
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. WALLET_TRANSACTIONS TABLE
-- ============================================
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('earn', 'spend', 'refund', 'topup', 'adjustment')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT NOT NULL,
    reference_type VARCHAR(50), -- e.g., 'reward_redemption', 'purchase', 'deal'
    reference_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 11. POINTS_HISTORY TABLE
-- ============================================
CREATE TABLE points_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL,
    points_before INTEGER NOT NULL,
    points_after INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 12. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'system' CHECK (category IN ('rewards', 'deals', 'system', 'account', 'promotion')),
    is_read BOOLEAN DEFAULT false,
    link VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 13. USER_SESSIONS TABLE
-- ============================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    refresh_token TEXT UNIQUE,
    device_info JSONB,
    ip_address INET,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 14. AUDIT_LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_points ON users(points);
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_active ON users(is_active);

-- Rewards indexes
CREATE INDEX idx_rewards_category ON rewards(category_id);
CREATE INDEX idx_rewards_brand ON rewards(brand_id);
CREATE INDEX idx_rewards_points ON rewards(points);
CREATE INDEX idx_rewards_popular ON rewards(is_popular);
CREATE INDEX idx_rewards_active ON rewards(is_active);
CREATE INDEX idx_rewards_valid ON rewards(valid_from, valid_until);

-- Redemptions indexes
CREATE INDEX idx_redemptions_user ON reward_redemptions(user_id);
CREATE INDEX idx_redemptions_reward ON reward_redemptions(reward_id);
CREATE INDEX idx_redemptions_status ON reward_redemptions(status);
CREATE INDEX idx_redemptions_date ON reward_redemptions(redeemed_at);

-- Deals indexes
CREATE INDEX idx_deals_category ON deals(category_id);
CREATE INDEX idx_deals_brand ON deals(brand_id);
CREATE INDEX idx_deals_featured ON deals(is_featured);
CREATE INDEX idx_deals_active ON deals(is_active);
CREATE INDEX idx_deals_valid ON deals(valid_from, valid_until);

-- Coupons indexes
CREATE INDEX idx_coupons_user ON coupons(user_id);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_used ON coupons(is_used);
CREATE INDEX idx_coupons_expires ON coupons(expires_at);

-- Stores indexes
CREATE INDEX idx_stores_location ON stores USING GIST (point(longitude, latitude));
CREATE INDEX idx_stores_active ON stores(is_active);

-- Transactions indexes
CREATE INDEX idx_wallet_trans_user ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_trans_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_trans_date ON wallet_transactions(created_at);

-- Points history indexes
CREATE INDEX idx_points_history_user ON points_history(user_id);
CREATE INDEX idx_points_history_date ON points_history(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_category ON notifications(category);
CREATE INDEX idx_notifications_date ON notifications(created_at);

-- Sessions indexes
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate distance between two points (in km)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL, lon1 DECIMAL,
    lat2 DECIMAL, lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    R DECIMAL := 6371; -- Earth radius in km
    dLat DECIMAL;
    dLon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dLat := radians(lat2 - lat1);
    dLon := radians(lon2 - lon1);
    
    a := sin(dLat/2) * sin(dLat/2) +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(dLon/2) * sin(dLon/2);
    
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get nearby stores
CREATE OR REPLACE FUNCTION get_nearby_stores(
    user_lat DECIMAL,
    user_lon DECIMAL,
    radius_km DECIMAL DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    address TEXT,
    phone VARCHAR,
    hours VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL,
    distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.address,
        s.phone,
        s.hours,
        s.latitude,
        s.longitude,
        calculate_distance(user_lat, user_lon, s.latitude, s.longitude) as distance
    FROM stores s
    WHERE s.is_active = true
        AND calculate_distance(user_lat, user_lon, s.latitude, s.longitude) <= radius_km
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to redeem reward
CREATE OR REPLACE FUNCTION redeem_reward(
    p_user_id UUID,
    p_reward_id UUID
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    coupon_code VARCHAR,
    transaction_id UUID,
    remaining_points INTEGER
) AS $$
DECLARE
    v_user_points INTEGER;
    v_reward_points INTEGER;
    v_reward_stock INTEGER;
    v_coupon_code VARCHAR(50);
    v_transaction_id UUID;
    v_new_balance INTEGER;
BEGIN
    -- Get user points
    SELECT points INTO v_user_points FROM users WHERE id = p_user_id;
    
    -- Get reward details
    SELECT points, stock_quantity INTO v_reward_points, v_reward_stock
    FROM rewards WHERE id = p_reward_id AND is_active = true;
    
    -- Check if reward exists
    IF v_reward_points IS NULL THEN
        RETURN QUERY SELECT false, 'ไม่พบของรางวัลนี้'::TEXT, NULL::VARCHAR, NULL::UUID, v_user_points;
        RETURN;
    END IF;
    
    -- Check if user has enough points
    IF v_user_points < v_reward_points THEN
        RETURN QUERY SELECT false, 'คะแนนของคุณไม่เพียงพอ'::TEXT, NULL::VARCHAR, NULL::UUID, v_user_points;
        RETURN;
    END IF;
    
    -- Check stock
    IF v_reward_stock = 0 THEN
        RETURN QUERY SELECT false, 'ของรางวัลหมดแล้ว'::TEXT, NULL::VARCHAR, NULL::UUID, v_user_points;
        RETURN;
    END IF;
    
    -- Generate coupon code
    v_coupon_code := 'CP' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Deduct points
    v_new_balance := v_user_points - v_reward_points;
    UPDATE users SET points = v_new_balance WHERE id = p_user_id;
    
    -- Create redemption record
    INSERT INTO reward_redemptions (user_id, reward_id, points_used, coupon_code, status, expires_at)
    VALUES (p_user_id, p_reward_id, v_reward_points, v_coupon_code, 'completed', CURRENT_TIMESTAMP + INTERVAL '30 days')
    RETURNING id INTO v_transaction_id;
    
    -- Update stock if not unlimited
    IF v_reward_stock > 0 THEN
        UPDATE rewards SET stock_quantity = stock_quantity - 1 WHERE id = p_reward_id;
    END IF;
    
    -- Record points history
    INSERT INTO points_history (user_id, points_change, points_before, points_after, reason, reference_type, reference_id)
    VALUES (p_user_id, -v_reward_points, v_user_points, v_new_balance, 'แลกของรางวัล', 'reward_redemption', v_transaction_id);
    
    -- Create notification
    INSERT INTO notifications (user_id, title, message, category)
    VALUES (p_user_id, 'แลกรางวัลสำเร็จ!', 'คุณได้แลกของรางวัลเรียบร้อยแล้ว รหัสคูปอง: ' || v_coupon_code, 'rewards');
    
    RETURN QUERY SELECT true, 'แลกรางวัลสำเร็จ!'::TEXT, v_coupon_code, v_transaction_id, v_new_balance;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'ตารางข้อมูลผู้ใช้งาน';
COMMENT ON TABLE categories IS 'ตารางหมวดหมู่สินค้าและบริการ';
COMMENT ON TABLE brands IS 'ตารางแบรนด์พาร์ทเนอร์';
COMMENT ON TABLE rewards IS 'ตารางของรางวัลที่แลกได้';
COMMENT ON TABLE reward_redemptions IS 'ตารางประวัติการแลกของรางวัล';
COMMENT ON TABLE deals IS 'ตารางดีลและโปรโมชั่น';
COMMENT ON TABLE coupons IS 'ตารางคูปองของผู้ใช้';
COMMENT ON TABLE banners IS 'ตารางแบนเนอร์โฆษณา';
COMMENT ON TABLE stores IS 'ตารางสาขาร้านค้า';
COMMENT ON TABLE wallet_transactions IS 'ตารางประวัติธุรกรรมกระเป๋าเงิน';
COMMENT ON TABLE points_history IS 'ตารางประวัติการเปลี่ยนแปลงคะแนน';
COMMENT ON TABLE notifications IS 'ตารางการแจ้งเตือน';
COMMENT ON TABLE user_sessions IS 'ตารางเซสชันผู้ใช้งาน';
COMMENT ON TABLE audit_logs IS 'ตารางบันทึกการตรวจสอบ';
