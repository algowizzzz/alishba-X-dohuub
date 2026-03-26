import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { ScreenHeader } from '../composite/ScreenHeader';

interface ListScreenTemplateProps<T> {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
  rightAction?: React.ReactNode;
}

/**
 * List screen template matching wireframe layout:
 * - Header with back button and title
 * - Optional search/filter header
 * - Scrollable list with items
 */
export function ListScreenTemplate<T>({
  title,
  showBack = true,
  onBack,
  data,
  renderItem,
  keyExtractor,
  ListHeaderComponent,
  ListEmptyComponent,
  refreshing = false,
  onRefresh,
  rightAction,
}: ListScreenTemplateProps<T>) {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={title}
        showBack={showBack}
        onBack={onBack}
        rightAction={rightAction}
      />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
});

