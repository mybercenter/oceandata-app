<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AppPage from '@/shared/components/page/AppPage.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import PasswordInput from '@/shared/components/PasswordInput.vue'
import { useAuth } from '@/shared/composables/useAuth'
import { useToast } from '@/shared/composables/useToast'
import http from '@/shared/services/http'
import {
  UserCircleIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  IdentificationIcon,
  LockClosedIcon
} from '@heroicons/vue/24/outline'

const { user, employee, fetchProfile } = useAuth()
const toast = useToast()

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const activeTab = ref<'profile' | 'password'>('profile')

// ─── Profile Form ─────────────────────────────────────────────────────────────
const isProfileLoading = ref(false)
const profileErrors = reactive<Record<string, string>>({})

const profileForm = reactive({
  username: '',
  email: ''
})

onMounted(() => {
  if (user.value) {
    profileForm.username = user.value.username || ''
    profileForm.email = user.value.email || ''
  }
})

const handleUpdateProfile = async () => {
  Object.keys(profileErrors).forEach(k => delete profileErrors[k])
  isProfileLoading.value = true

  try {
    await http.put('/auth/profile', {
      username: profileForm.username,
      email: profileForm.email
    })
    await fetchProfile()
    toast.success('Profile Updated', 'Your profile has been updated successfully.')
  } catch (err: any) {
    const data = err?.response?.data
    if (data?.errors) {
      Object.assign(profileErrors, data.errors)
    } else {
      toast.error('Update Failed', data?.message || 'Failed to update profile.')
    }
  } finally {
    isProfileLoading.value = false
  }
}

// ─── Password Form ─────────────────────────────────────────────────────────────
const isPasswordLoading = ref(false)
const passwordErrors = reactive<Record<string, string>>({})
const passwordSuccess = ref(false)

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const passwordStrength = computed(() => {
  const pw = passwordForm.new_password
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
})

const passwordStrengthLabel = computed(() => {
  const s = passwordStrength.value
  if (s === 0) return ''
  if (s === 1) return 'Weak'
  if (s === 2) return 'Fair'
  if (s === 3) return 'Good'
  return 'Strong'
})

const passwordStrengthColor = computed(() => {
  const s = passwordStrength.value
  if (s === 1) return 'bg-red-500'
  if (s === 2) return 'bg-amber-500'
  if (s === 3) return 'bg-blue-500'
  if (s === 4) return 'bg-emerald-500'
  return 'bg-gray-200'
})

const handleChangePassword = async () => {
  Object.keys(passwordErrors).forEach(k => delete passwordErrors[k])
  passwordSuccess.value = false

  if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
    passwordErrors.new_password_confirmation = 'Password confirmation does not match.'
    return
  }
  if (passwordForm.new_password.length < 8) {
    passwordErrors.new_password = 'Password must be at least 8 characters.'
    return
  }

  isPasswordLoading.value = true
  try {
    await http.post('/auth/change-password', {
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
      new_password_confirmation: passwordForm.new_password_confirmation
    })
    passwordSuccess.value = true
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordForm.new_password_confirmation = ''
    toast.success('Password Changed', 'Your password has been updated successfully.')
  } catch (err: any) {
    const data = err?.response?.data
    if (data?.errors) {
      Object.assign(passwordErrors, data.errors)
    } else {
      toast.error('Change Failed', data?.message || 'Failed to change password.')
    }
  } finally {
    isPasswordLoading.value = false
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avatarInitial = computed(() => {
  const name = employee.value?.full_name || user.value?.username || 'U'
  return name.charAt(0).toUpperCase()
})

const displayName = computed(() => employee.value?.full_name || user.value?.username || '-')
const roleName = computed(() => employee.value?.role?.name || (user.value as any)?.role?.name || 'User')
</script>

<template>
  <AppPage title="My Profile" subtitle="Manage your personal information and account security.">
    <div class="max-w-4xl mx-auto space-y-6">

      <!-- ─── Profile Hero Card ─────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Avatar + Name -->
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {{ avatarInitial }}
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">{{ displayName }}</h2>
              <div class="flex items-center gap-2 mt-1 flex-wrap">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200">
                  <ShieldCheckIcon class="w-3 h-3" />
                  {{ roleName }}
                </span>
                <span v-if="employee?.employee_code" class="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {{ employee.employee_code }}
                </span>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 flex-wrap">
            <div v-if="employee?.store?.name" class="flex items-center gap-1.5 text-sm text-gray-500">
              <BuildingOffice2Icon class="w-4 h-4 text-gray-400" />
              {{ employee.store.name }}
            </div>
            <div v-if="employee?.areas?.length" class="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPinIcon class="w-4 h-4 text-gray-400" />
              {{ employee.areas.length }} Area(s)
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Tabs Card ──────────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Tab Nav -->
        <div class="flex border-b border-gray-100">
          <button
            id="tab-profile"
            @click="activeTab = 'profile'"
            :class="[
              'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'profile'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <PencilSquareIcon class="w-4 h-4" />
            Edit Profile
          </button>
          <button
            id="tab-password"
            @click="activeTab = 'password'"
            :class="[
              'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'password'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <LockClosedIcon class="w-4 h-4" />
            Change Password
          </button>
        </div>

        <!-- ── Tab: Edit Profile ───────────────────────────────────────── -->
        <Transition name="tab-fade" mode="out-in">
          <div v-if="activeTab === 'profile'" key="profile" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <!-- Left: Employee Info (read-only) -->
              <div class="lg:col-span-1 space-y-4">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <IdentificationIcon class="w-4 h-4" />
                  Employee Info
                </h3>

                <div class="space-y-3">
                  <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-0.5">Full Name</p>
                    <p class="text-sm font-medium text-gray-800">{{ employee?.full_name || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-0.5">Employee Code</p>
                    <p class="text-sm font-mono font-medium text-gray-800">{{ employee?.employee_code || '-' }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-0.5">Role</p>
                    <p class="text-sm font-medium text-gray-800">{{ roleName }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p class="text-xs text-gray-400 mb-0.5">Store</p>
                    <p class="text-sm font-medium text-gray-800">{{ employee?.store?.name || '-' }}</p>
                  </div>
                </div>
                <p class="text-xs text-gray-400 italic leading-relaxed">
                  Employee information is managed by your administrator and cannot be changed here.
                </p>
              </div>

              <!-- Right: Account Form -->
              <div class="lg:col-span-2">
                <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-5">
                  <UserCircleIcon class="w-4 h-4" />
                  Account Information
                </h3>

                <form @submit.prevent="handleUpdateProfile" class="space-y-5">
                  <AppInput
                    id="profile-username"
                    v-model="profileForm.username"
                    label="Username"
                    placeholder="Enter your username"
                    required
                    :error="profileErrors.username"
                  />
                  <AppInput
                    id="profile-email"
                    v-model="profileForm.email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    :error="profileErrors.email"
                    helper-text="Used for notifications and password reset emails."
                  />

                  <div class="pt-2 flex justify-end">
                    <AppButton
                      id="btn-save-profile"
                      type="submit"
                      :loading="isProfileLoading"
                      variant="primary"
                      size="md"
                    >
                      <CheckCircleIcon class="w-4 h-4 mr-2" />
                      Save Changes
                    </AppButton>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- ── Tab: Change Password ────────────────────────────────────── -->
          <div v-else key="password" class="p-6">
            <div class="max-w-lg mx-auto">
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-6">
                <LockClosedIcon class="w-4 h-4" />
                Change Your Password
              </h3>

              <!-- Success Banner -->
              <Transition name="slide-down">
                <div v-if="passwordSuccess" class="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <CheckCircleIcon class="w-5 h-5 flex-shrink-0" />
                  <p class="text-sm font-medium">Password changed successfully!</p>
                </div>
              </Transition>

              <form @submit.prevent="handleChangePassword" class="space-y-5">
                <PasswordInput
                  id="current-password"
                  v-model="passwordForm.current_password"
                  label="Current Password"
                  placeholder="Enter your current password"
                  required
                  :error="passwordErrors.current_password"
                />

                <div class="border-t border-gray-100 pt-5 space-y-5">
                  <div>
                    <PasswordInput
                      id="new-password"
                      v-model="passwordForm.new_password"
                      label="New Password"
                      placeholder="Min. 8 characters"
                      required
                      :error="passwordErrors.new_password"
                    />

                    <!-- Password Strength Bar -->
                    <Transition name="slide-down">
                      <div v-if="passwordForm.new_password" class="mt-2.5 space-y-1">
                        <div class="flex gap-1">
                          <div
                            v-for="i in 4"
                            :key="i"
                            class="h-1.5 flex-1 rounded-full transition-all duration-300"
                            :class="i <= passwordStrength ? passwordStrengthColor : 'bg-gray-200'"
                          />
                        </div>
                        <p class="text-xs font-medium" :class="{
                          'text-red-500': passwordStrength === 1,
                          'text-amber-500': passwordStrength === 2,
                          'text-blue-500': passwordStrength === 3,
                          'text-emerald-500': passwordStrength === 4,
                        }">
                          Strength: {{ passwordStrengthLabel }}
                        </p>
                      </div>
                    </Transition>
                  </div>

                  <PasswordInput
                    id="confirm-password"
                    v-model="passwordForm.new_password_confirmation"
                    label="Confirm New Password"
                    placeholder="Re-enter new password"
                    required
                    :error="passwordErrors.new_password_confirmation"
                  />
                </div>

                <!-- Password Rules Checklist -->
                <ul class="space-y-1.5">
                  <li
                    v-for="rule in [
                      { label: 'At least 8 characters', check: passwordForm.new_password.length >= 8 },
                      { label: 'Contains uppercase letter (A-Z)', check: /[A-Z]/.test(passwordForm.new_password) },
                      { label: 'Contains a number (0-9)', check: /[0-9]/.test(passwordForm.new_password) },
                      { label: 'Contains special character (!@#$...)', check: /[^A-Za-z0-9]/.test(passwordForm.new_password) },
                    ]"
                    :key="rule.label"
                    class="flex items-center gap-2 text-xs transition-colors duration-200"
                    :class="rule.check ? 'text-emerald-600' : 'text-gray-400'"
                  >
                    <svg class="w-3.5 h-3.5 flex-shrink-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path v-if="rule.check" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      <circle v-else cx="12" cy="12" r="4" stroke-width="2" />
                    </svg>
                    {{ rule.label }}
                  </li>
                </ul>

                <div class="pt-1 flex justify-end">
                  <AppButton
                    id="btn-change-password"
                    type="submit"
                    :loading="isPasswordLoading"
                    variant="primary"
                    size="md"
                  >
                    <LockClosedIcon class="w-4 h-4 mr-2" />
                    Update Password
                  </AppButton>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </div>

    </div>
  </AppPage>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.2s ease;
}
.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
