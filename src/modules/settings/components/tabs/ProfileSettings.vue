<script setup lang="ts">
import { ref, computed } from 'vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import PasswordInput from '@/shared/components/PasswordInput.vue'

const props = defineProps<{
  modelValue: any
  isSaving: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save', 'reset'])

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const avatarText = computed(() => {
  return props.modelValue.fullName?.split(' ').map((n:string) => n[0]).join('').substring(0, 2).toUpperCase() || 'AD'
})

const passwordStrength = computed(() => {
  const p = newPassword.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score += 25
  if (/[A-Z]/.test(p)) score += 25
  if (/[0-9]/.test(p)) score += 25
  if (/[^A-Za-z0-9]/.test(p)) score += 25
  return score
})

const strengthColor = computed(() => {
  const s = passwordStrength.value
  if (s <= 25) return 'bg-red-500'
  if (s <= 50) return 'bg-orange-500'
  if (s <= 75) return 'bg-yellow-500'
  return 'bg-emerald-500'
})
</script>
<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="text-lg font-bold text-gray-900 border-b pb-3 mb-6">My Profile</h2>
      
      <div class="space-y-6 max-w-2xl">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full bg-primary-100 border-2 border-primary-500 flex items-center justify-center text-primary-700 text-2xl font-bold flex-shrink-0">
            {{ avatarText }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-gray-900 mb-1">Profile Photo</h4>
            <div class="flex gap-2">
              <AppButton variant="outline" size="sm">Change Avatar</AppButton>
            </div>
          </div>
        </div>

        <AppInput label="Full Name" v-model="modelValue.fullName" />
        <AppInput label="Username" v-model="modelValue.username" disabled />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput label="Phone Number" v-model="modelValue.phone" />
          <AppInput label="Email Address" type="email" v-model="modelValue.email" />
        </div>
        
        <div class="flex justify-end gap-3 pt-6 border-t mt-8">
          <AppButton variant="outline" @click="emit('reset')">Discard Changes</AppButton>
          <AppButton variant="primary" @click="emit('save')" :loading="isSaving">Save Profile</AppButton>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 class="text-lg font-bold text-red-600 border-b pb-3 mb-6">Change Password</h2>
      <div class="space-y-4 max-w-lg">
        <PasswordInput label="Current Password" v-model="currentPassword" />
        
        <div class="pt-2">
          <PasswordInput label="New Password" v-model="newPassword" />
          <!-- Password Strength Indicator -->
          <div class="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
            <div class="h-full transition-all duration-300" :class="strengthColor" :style="{ width: passwordStrength + '%' }"></div>
          </div>
          <p class="text-xs text-gray-500 mt-1 flex justify-between">
            <span>Strength</span>
            <span v-if="passwordStrength===100" class="text-emerald-600 font-bold">Strong</span>
            <span v-else-if="passwordStrength>=50" class="text-orange-600">Medium</span>
            <span v-else-if="passwordStrength>0" class="text-red-600">Weak</span>
          </p>
        </div>

        <PasswordInput label="Confirm New Password" v-model="confirmPassword" />
        
        <div class="pt-4">
          <AppButton variant="primary" :disabled="!currentPassword || !newPassword || newPassword !== confirmPassword">Update Password</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
