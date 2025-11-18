<template>
  <div class="login-page flex justify-content-center align-items-center">
    <Card class="login-page__card">
      <template #content>
        <div class="flex justify-content-center mb-4">
          <img src="../../assets/images/logo.png" alt="Logo" class="login-page__logo" />
        </div>
        <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="resolver"
          :validateOnValueUpdate="false"
          :validateOnBlur="true"
          :validateOnMount="false"
          @submit="handleSubmitLogin"
        >
          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="token" class="font-semibold">Token</label>
              <Textarea id="token" placeholder="Enter your token" name="token" rows="5" class="w-full" />
              <Message v-if="$form.token?.invalid" severity="error" size="small" variant="simple">{{
                $form.token.error.message
              }}</Message>
            </div>
            <Button type="submit" severity="secondary" label="Sign In" class="w-full" />
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'
import type { FormResolverOptions, FormSubmitEvent } from '@primevue/forms'
import { useAuthStore } from '@/stores/auth.store'
import { AuthService } from '@/services/auth/auth.service'
import { useAgentStore } from '@/stores/agent.store'
import { useRouter } from 'vue-router'
import type { FormError } from './login.page.type'

const initialValues = ref({
  token: '',
})

const router = useRouter()
const authStore = useAuthStore()
const agentStore = useAgentStore()

const handleSubmitLogin = async (values: FormSubmitEvent<Record<string, string>>) => {
  try {
    const token = values.states.token?.value
    if (token !== undefined) {
      authStore.login(token)
      const agent = await AuthService.getAccountDetails()
      agentStore.setAuthenticatedAgent(agent)
      router.push({ name: 'Home' })
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const resolver = (options: FormResolverOptions) => {
  const { values } = options
  const errors: Record<string, FormError[]> = {}

  if (!values.token || values.token.trim() === '') {
    errors.token = [{ message: 'Token is required.' }]
  }

  return {
    errors,
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background: var(--surface-ground);
}

.login-page__card {
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--surface-border);
}

.login-page__logo {
  max-width: 150px;
  height: auto;
}
</style>
