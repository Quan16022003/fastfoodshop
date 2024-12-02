/**
 * Service xử lý các logic liên quan đến menu
 */

/**
 * Lọc danh sách món ăn theo danh mục
 * @param {Array} items - Danh sách tất cả món ăn
 * @param {String} categoryId - ID của danh mục được chọn
 * @param {Array} categories - Danh sách các danh mục
 * @returns {Array} Danh sách món ăn đã được lọc
 */
export const filterItemsByCategory = (items, categoryId, categories) => {
  if (!items || !categories) return [];
  
  return items.filter(item => 
    categoryId === 'all' || 
    item.category === categories.find(cat => cat.id === categoryId)?.name
  );
};

/**
 * Lọc danh sách món ăn theo từ khóa tìm kiếm
 * @param {Array} items - Danh sách món ăn
 * @param {String} searchQuery - Từ khóa tìm kiếm
 * @returns {Array} Danh sách món ăn đã được lọc
 */
export const filterItemsBySearch = (items, searchQuery) => {
  if (!items) return [];
  if (!searchQuery) return items;

  const query = searchQuery.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );
};

/**
 * Lọc danh sách món ăn theo cả danh mục và từ khóa
 * @param {Array} items - Danh sách tất cả món ăn
 * @param {String} categoryId - ID của danh mục được chọn
 * @param {Array} categories - Danh sách các danh mục
 * @param {String} searchQuery - Từ khóa tìm kiếm
 * @returns {Array} Danh sách món ăn đã được lọc
 */
export const filterItems = (items, categoryId, categories, searchQuery) => {
  const itemsByCategory = filterItemsByCategory(items, categoryId, categories);
  return filterItemsBySearch(itemsByCategory, searchQuery);
}; 