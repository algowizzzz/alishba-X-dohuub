import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getServiceImage } from '../../../src/constants/serviceImages';
import { getStoresByCategory, getGroceryListings } from '../../../src/lib/queries';
import { useCartStore } from '../../../src/store/cartStore';
import { Card, Rating, PoweredByDoHuubBadge } from '../../../src/components/ui';
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';

const SAMPLE_GROCERY_VENDORS = [
  { id: 'g1', name: 'DoHuub Supermarket', type: 'Supermarket, Groceries', rating: 4.8, deliveryTime: '20-30 min', isPoweredByDoHuub: true,  image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=200&h=200&fit=crop' },
  { id: 'g2', name: 'Fresh Market',       type: 'Supermarket, Groceries', rating: 4.7, deliveryTime: '25-40 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop' },
  { id: 'g3', name: 'Quick Stop Grocer',  type: 'Supermarket, Groceries', rating: 4.5, deliveryTime: '15-25 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=200&h=200&fit=crop' },
  { id: 'g4', name: 'Organic Valley',     type: 'Organic, Fresh Produce', rating: 4.9, deliveryTime: '30-45 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop' },
  { id: 'g5', name: 'City Supermarket',   type: 'Supermarket, Groceries', rating: 4.4, deliveryTime: '20-35 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop' },
];

const SAMPLE_FOOD_VENDORS = [
  { id: 'f1', name: 'DoHuub Kitchen',    cuisine: 'Multi-Cuisine',     rating: 4.9, deliveryTime: '20-30 min', isPoweredByDoHuub: true,  image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop' },
  { id: 'f2', name: 'The Italian Corner', cuisine: 'Italian, Pizza',   rating: 4.7, deliveryTime: '25-35 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
  { id: 'f3', name: 'Sushi Masters',     cuisine: 'Japanese, Sushi',   rating: 4.8, deliveryTime: '30-40 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop' },
  { id: 'f4', name: 'Biryani House',     cuisine: 'Indian, Biryani',   rating: 4.6, deliveryTime: '35-45 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
  { id: 'f5', name: 'Burger Paradise',   cuisine: 'American, Burgers', rating: 4.5, deliveryTime: '20-30 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { id: 'f6', name: 'Thai Delight',      cuisine: 'Thai, Asian',       rating: 4.7, deliveryTime: '30-40 min', isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=200&h=200&fit=crop' },
];

export default function GroceriesScreen() {
  const [subCategory, setSubCategory] = useState<'food' | 'grocery' | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { items: cartItems, addItem } = useCartStore();

  useEffect(() => {
    if (subCategory) fetchVendors();
  }, [subCategory]);

  useEffect(() => {
    if (selectedVendor) {
      fetchListings();
    }
  }, [selectedVendor, selectedCategory]);

  const fetchVendors = async () => {
    try {
      const cat = subCategory === 'food' ? 'FOOD' : 'GROCERIES';
      const data = await getStoresByCategory(cat);
      // Map stores to vendor-like shape for rendering
      setVendors(data.map((store: any) => ({
        id: store.id,
        businessName: store.name,
        description: store.description,
        rating: store.Vendor?.rating || 0,
        reviewCount: store.Vendor?.reviewCount || 0,
        isMichelle: store.Vendor?.isMichelle || false,
      })));
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const data = await getGroceryListings(selectedVendor || undefined);
      const filtered = selectedCategory === 'all' ? data : data.filter((item: any) => item.category === selectedCategory);
      setListings(filtered);
      // Extract unique categories
      const cats = [...new Set(data.map((item: any) => item.category).filter(Boolean))] as string[];
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedVendor) {
      await fetchListings();
    } else {
      await fetchVendors();
    }
    setRefreshing(false);
  };

  const handleAddToCart = async (listingId: string) => {
    try {
      await addItem(listingId);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const renderVendorCard = ({ item, index }: { item: any; index: number }) => (
    <Card style={styles.vendorCard} onPress={() => setSelectedVendor(item.id)}>
      <View style={styles.cardRow}>
        {/* Left: Service Image */}
        <Image
          source={{ uri: getServiceImage('groceries', index, item.logo ?? item.coverImage) }}
          style={styles.cardImage}
        />

        {/* Right: Info */}
        <View style={styles.vendorContent}>
          <View style={styles.nameRow}>
            <Text style={styles.vendorName} numberOfLines={1}>{item.businessName}</Text>
            {item.isMichelle && <PoweredByDoHuubBadge />}
          </View>

          <View style={styles.ratingRow}>
            <Rating rating={item.rating || 0} reviewCount={item.reviewCount || 0} size="sm" />
          </View>

          <Text style={styles.vendorDescription} numberOfLines={1}>{item.description}</Text>
        </View>
      </View>
    </Card>
  );

  const renderProductCard = ({ item, index }: { item: any; index: number }) => {
    const inCart = cartItems.some(ci => ci.listingId === item.id);

    return (
      <Card style={styles.productCard}>
        <Image
          source={{ uri: item.image ?? getServiceImage('groceries', index) }}
          style={styles.productImage}
        />
        <View style={styles.productContent}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${item.price}/{item.unit}</Text>
            <TouchableOpacity
              style={[styles.addButton, inCart && styles.addButtonActive]}
              onPress={() => handleAddToCart(item.id)}
            >
              <Ionicons 
                name={inCart ? "checkmark" : "add"} 
                size={20} 
                color={inCart ? colors.text.inverse : colors.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  if (selectedVendor) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedVendor(null)}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Products</Text>
          <TouchableOpacity onPress={() => router.push('/cart' as any)}>
            <View style={styles.cartButton}>
              <Ionicons name="cart" size={24} color={colors.text.primary} />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, selectedCategory === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[styles.filterTabText, selectedCategory === 'all' && styles.filterTabTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterTab, selectedCategory === cat && styles.filterTabActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.filterTabText, selectedCategory === cat && styles.filterTabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={listings}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
          columnWrapperStyle={styles.productRow}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  // ── Category Picker ──────────────────────────────────────────────────────
  if (!subCategory) {
    return (
      <View style={styles.container}>
        {/* Header — back button + stacked title/subtitle */}
        <View style={styles.pickerHeader}>
          <TouchableOpacity style={styles.pickerBackBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.pickerTitle}>Groceries & Food</Text>
            <Text style={styles.pickerSubtitle}>Choose your category</Text>
          </View>
        </View>

        {/* Two equal-height cards */}
        <View style={styles.pickerContent}>
          <TouchableOpacity style={styles.categoryCard} activeOpacity={0.85} onPress={() => setSubCategory('food')}>
            <Image source={require('../../../assets/food.png')} style={styles.categoryImg} resizeMode="contain" />
            <View style={styles.categoryTextBlock}>
              <Text style={styles.categoryCardTitle}>Food</Text>
              <Text style={styles.categoryCardDesc}>Order from restaurants and get food delivered to your door</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard} activeOpacity={0.85} onPress={() => setSubCategory('grocery')}>
            <Image source={require('../../../assets/grocery.png')} style={styles.categoryImg} resizeMode="contain" />
            <View style={styles.categoryTextBlock}>
              <Text style={styles.categoryCardTitle}>Grocery</Text>
              <Text style={styles.categoryCardDesc}>Shop fresh groceries and household essentials</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Food Delivery List ───────────────────────────────────────────────────
  if (subCategory === 'food') {
    const foodVendors = vendors.length > 0
      ? vendors.map(v => ({ ...v, cuisine: v.description || 'Multi-Cuisine', deliveryTime: '20-35 min' }))
      : SAMPLE_FOOD_VENDORS;
    return (
      <View style={styles.container}>
        <View style={styles.pickerHeader}>
          <TouchableOpacity style={styles.pickerBackBtn} onPress={() => { setSubCategory(null); setVendors([]); }}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.pickerTitle}>Food Delivery</Text>
            <Text style={styles.pickerSubtitle}>Choose from top restaurants</Text>
          </View>
        </View>

        <FlatList
          data={foodVendors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.foodListContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.foodCard}>
              <View style={styles.foodCardTop}>
                <Image source={{ uri: item.image }} style={styles.foodCardImg} resizeMode="cover" />
                <View style={styles.foodCardInfo}>
                  <View style={styles.foodCardNameRow}>
                    <Text style={styles.foodCardName} numberOfLines={1}>{item.name}</Text>
                    {item.isPoweredByDoHuub && (
                      <View style={styles.dohuubBadge}>
                        <Text style={styles.dohuubBadgeText}>DoHuub</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.foodCardCuisine} numberOfLines={1}>{item.cuisine}</Text>
                  <View style={styles.foodCardMeta}>
                    <Ionicons name="star" size={14} color="#FACC15" />
                    <Text style={styles.foodCardRating}>{item.rating}</Text>
                    <Ionicons name="time-outline" size={14} color={colors.text.secondary} style={{ marginLeft: 12 }} />
                    <Text style={styles.foodCardTime}>{item.deliveryTime}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.foodCardBtns}>
                <TouchableOpacity
                  style={styles.viewMenuBtn}
                  onPress={() => router.push({
                    pathname: '/services/food/[id]',
                    params: {
                      id: item.id,
                      name: item.name,
                      cuisine: item.cuisine,
                      isPoweredByDoHuub: String(item.isPoweredByDoHuub ?? false),
                      menuId: String(foodVendors.indexOf(item) + 1),
                    },
                  } as any)}
                >
                  <Text style={styles.viewMenuBtnText}>View Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewProfileBtn}
                  onPress={() => router.push({
                    pathname: '/services/food/profile',
                    params: {
                      id: item.id,
                      name: item.name,
                      cuisine: item.cuisine,
                      isPoweredByDoHuub: String(item.isPoweredByDoHuub ?? false),
                      rating: String(item.rating),
                      deliveryTime: item.deliveryTime,
                      menuId: String(foodVendors.indexOf(item) + 1),
                    },
                  } as any)}
                >
                  <Text style={styles.viewProfileBtnText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  // ── Grocery List ─────────────────────────────────────────────────────────
  const groceryVendors = vendors.length > 0
    ? vendors.map(v => ({ id: v.id, name: v.businessName, type: v.description || 'Grocery', rating: v.rating, reviewCount: v.reviewCount, isPoweredByDoHuub: v.isMichelle }))
    : SAMPLE_GROCERY_VENDORS;

  return (
    <View style={styles.container}>
      <View style={styles.pickerHeader}>
        <TouchableOpacity style={styles.pickerBackBtn} onPress={() => { setSubCategory(null); setVendors([]); setSelectedVendor(null); }}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pickerTitle}>Grocery Delivery</Text>
          <Text style={styles.pickerSubtitle}>Shop from top stores near you</Text>
        </View>
      </View>

      <FlatList
        data={groceryVendors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.foodListContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.groceryCard}>
            {/* Vendor Icon */}
            <View style={styles.groceryCardTop}>
              <View style={styles.groceryIconWrap}>
                <Image source={{ uri: item.image }} style={styles.groceryIconImg} resizeMode="cover" />
              </View>
              <View style={styles.groceryCardInfo}>
                <View style={styles.groceryNameRow}>
                  <Text style={styles.groceryCardName} numberOfLines={1}>{item.name}</Text>
                  {item.isPoweredByDoHuub && (
                    <View style={styles.greenBadge}>
                      <Text style={styles.greenBadgeText}>DoHuub</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.groceryCardType}>{item.type}</Text>
                <View style={styles.groceryCardMeta}>
                  <Ionicons name="star" size={13} color="#FACC15" />
                  <Text style={styles.groceryRating}>{item.rating}</Text>
                  <Ionicons name="time-outline" size={13} color={colors.text.secondary} style={{ marginLeft: 10 }} />
                  <Text style={styles.groceryReviews}>{item.deliveryTime}</Text>
                </View>
              </View>
            </View>
            <View style={styles.groceryCardBtns}>
              <TouchableOpacity
                style={styles.shopNowBtn}
                onPress={() => router.push({ pathname: '/services/grocery/[id]', params: { id: item.id, name: item.name, isPoweredByDoHuub: String(item.isPoweredByDoHuub ?? false) } } as any)}
              >
                <Text style={styles.shopNowBtnText}>Shop Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.groceryProfileBtn}
                onPress={() => router.push({ pathname: '/services/grocery/profile', params: { id: item.id, name: item.name, type: item.type, rating: String(item.rating), reviewCount: String(item.reviewCount), isPoweredByDoHuub: String(item.isPoweredByDoHuub ?? false) } } as any)}
              >
                <Text style={styles.groceryProfileBtnText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  pickerBackBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  pickerSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  pickerContent: { flex: 1, paddingHorizontal: 24, paddingVertical: 32, gap: 24 },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  categoryImg: { width: 98, height: 98 },
  categoryTextBlock: { alignItems: 'center', gap: 8 },
  categoryCardTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text.primary },
  categoryCardDesc: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center', lineHeight: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  backButton: { padding: spacing.xs },
  title: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text.primary },
  placeholder: { width: 32 },
  cartButton: { position: 'relative', padding: spacing.xs },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.status.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { fontSize: 10, color: colors.text.inverse, fontWeight: '600' },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: fontSize.sm, color: colors.text.secondary, fontWeight: '500' },
  filterTabTextActive: { color: colors.text.inverse },
  listContent: { padding: spacing.lg },
  vendorCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(46, 122, 217, 0.08)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  ratingRow: {
    marginBottom: 4,
  },
  vendorContent: { flex: 1, minWidth: 0 },
  vendorName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, flexShrink: 1 },
  vendorDescription: { fontSize: fontSize.sm, color: colors.text.secondary },
  productGrid: { padding: spacing.md },
  productRow: { justifyContent: 'space-between' },
  productCard: { width: '48%', marginBottom: spacing.md, padding: spacing.sm },
  productImage: {
    height: 80,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  productContent: { flex: 1 },
  productName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  productCategory: { fontSize: fontSize.xs, color: colors.text.muted },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  productPrice: { fontSize: fontSize.md, fontWeight: '600', color: colors.primary },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonActive: { backgroundColor: colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl * 2 },
  emptyText: { fontSize: fontSize.md, color: colors.text.muted, marginTop: spacing.md },
  // Food Delivery list
  foodListContent: { padding: 24, gap: 16 },
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  foodCardTop: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  foodCardImg: { width: 72, height: 72, borderRadius: 12, flexShrink: 0, overflow: 'hidden' },
  foodCardInfo: { flex: 1, minWidth: 0 },
  foodCardNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 2 },
  foodCardName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, flex: 1 },
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  dohuubBadgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  foodCardCuisine: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 6 },
  foodCardMeta: { flexDirection: 'row', alignItems: 'center' },
  foodCardRating: { fontSize: fontSize.sm, color: colors.text.primary, marginLeft: 4 },
  foodCardTime: { fontSize: fontSize.sm, color: colors.text.secondary, marginLeft: 4 },
  foodCardBtns: { flexDirection: 'row', gap: 8 },
  viewMenuBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    backgroundColor: colors.primary, alignItems: 'center',
  },
  viewMenuBtnText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: '600' },
  viewProfileBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    backgroundColor: colors.background, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)',
  },
  viewProfileBtnText: { color: colors.text.primary, fontSize: fontSize.sm, fontWeight: '500' },
  // Grocery vendor list
  groceryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  groceryCardTop: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  groceryIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    flexShrink: 0,
  },
  groceryIconImg: { width: 72, height: 72 },
  groceryCardInfo: { flex: 1, minWidth: 0 },
  groceryNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  groceryCardName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, flex: 1 },
  greenBadge: { backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  greenBadgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  groceryCardType: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 5 },
  groceryCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  groceryRating: { fontSize: fontSize.sm, color: colors.text.primary, fontWeight: '600', marginLeft: 3 },
  groceryReviews: { fontSize: fontSize.xs, color: colors.text.secondary, marginLeft: 3 },
  groceryCardBtns: { flexDirection: 'row', gap: 8 },
  shopNowBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#10B981', alignItems: 'center',
  },
  shopNowBtnText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: '600' },
  groceryProfileBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    backgroundColor: colors.background, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)',
  },
  groceryProfileBtnText: { color: colors.text.primary, fontSize: fontSize.sm, fontWeight: '500' },
});

