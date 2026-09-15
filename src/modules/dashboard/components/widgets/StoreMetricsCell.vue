<script setup lang="ts">
import type { StorePerformanceMetric } from '../../../services/dashboard.service'

defineProps<{
  metrics: StorePerformanceMetric
}>()
</script>

<template>
  <div class="flex flex-col gap-y-1.5 text-[10.5px] leading-tight min-w-[160px]">
    <!-- Row 1: Cust, Beli, Tanya -->
    <div class="flex items-center gap-x-3">
      <div class="flex items-center gap-1" title="Customers">
        <span class="text-gray-400 font-medium">Cust:</span>
        <span class="font-bold text-gray-900">{{ metrics.customers }}</span>
      </div>
      <div class="flex items-center gap-1" title="Purchased">
        <span class="text-gray-400 font-medium">Beli:</span>
        <span class="font-bold text-success-600">{{ metrics.purchased }}</span>
      </div>
      <div class="flex items-center gap-1" title="Inquiry">
        <span class="text-gray-400 font-medium">Tanya:</span>
        <span class="font-bold text-info-600">{{ metrics.inquiry }}</span>
      </div>
    </div>
    <!-- Row 2: FU, Pot, Pros, Hot -->
    <div class="flex items-center gap-x-3 border-t border-gray-100 pt-1.5">
      <div class="flex items-center gap-1" title="Follow Up">
        <span class="text-gray-400 font-medium">FU:</span>
        <span class="font-bold text-primary-600">{{ metrics.follow_ups }}</span>
      </div>
      <div class="flex items-center gap-1" title="Potential">
        <span class="text-gray-400 font-medium">Pot:</span>
        <span class="font-bold text-warning-600">{{ metrics.potential }}</span>
      </div>
      <div class="flex items-center gap-1" title="Prospect">
        <span class="text-gray-400 font-medium">Pros:</span>
        <span class="font-bold text-indigo-600">{{ metrics.prospect }}</span>
      </div>
      <div class="flex items-center gap-1" title="Hot Prospect">
        <span class="text-gray-400 font-medium">Hot:</span>
        <span class="font-bold text-danger-600">{{ metrics.hot_prospect }}</span>
      </div>
    </div>
  </div>
</template>
