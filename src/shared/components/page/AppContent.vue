<template>
  <div class="flex-1 flex flex-col min-h-0 w-full">
    <!-- Optional slot for filters or tabs that sit above the main content block -->
    <slot name="top" />
    
    <div class="flex-1 relative">
      <slot />
    </div>
  </div>
</template>
