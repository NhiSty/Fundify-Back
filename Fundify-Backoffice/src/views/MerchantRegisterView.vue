<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const registerFormData = reactive({
  email: '',
  password: '',
  contactEmail: '',
  companyName: '',
  kbis: '',
  contactPhone: '',
  currency: '',
  confirmationRedirectUrl: '',
  cancellationRedirectUrl: '',
  domain: '',
  lastname: '',
  firstname: '',
});

const output = ref('');

function onFileChange(e) {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    registerFormData.kbis = file;
  } else {
    alert('Veuillez télécharger un fichier PDF.');
    registerFormData.kbis = '';
  }
}

function createBase64File(fileObject) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileObject);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
}

async function register() {
  // Make sure all fields are filled
  if (!registerFormData.email
      || !registerFormData.password
      || !registerFormData.contactEmail
      || !registerFormData.companyName
      || !registerFormData.kbis
      || !registerFormData.contactPhone
      || !registerFormData.currency
      || !registerFormData.confirmationRedirectUrl
      || !registerFormData.cancellationRedirectUrl
      || !registerFormData.domain
      || !registerFormData.lastname
      || !registerFormData.firstname) {
    output.value = 'Veuillez remplir tous les champs';
    return;
  }

  const base64File = await createBase64File(registerFormData.kbis);
  const { kbis, ...restInput } = registerFormData;

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      kbis: base64File,
      ...restInput,
    }),
  });

  if (response.ok) {
    router.push('/login');
  } else if (response.status === 409) {
    output.value = 'Cet email est déjà utilisé';
  } else {
    output.value = 'Une erreur est survenue';
  }
}

</script>

<template>
  <form @submit.prevent="register" name="login-form" class="max-w-sm mx-auto">
     <h2 class="my-2 text-2xl">Nouveau client ? Par ici, je vous prie.</h2>

      <div class="mb-4">
        <label for="companyName" class="block text-sm font-medium text-gray-700">Nom de l'entreprise <span style="color: red;">*</span></label>
        <input
            id="companyName"
            v-model="registerFormData.companyName"
            type="text"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div class="mb-4">
        <label for="kbis" class="block text-sm font-medium text-gray-700">KBIS <span style="color: red;">*</span></label>
        <input
          type="file"
          id="kbis"
          accept="application/pdf"
          @change="onFileChange"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email <span style="color: red;">*</span></label>
        <input
          type="email"
          id="email"
          v-model="registerFormData.email"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
      </div>
    <div class="mb-4">
      <label for="contactEmail" class="block text-sm font-medium text-gray-700">Email de contact de secours <span style="color: red;">*</span></label>
      <input
          type="email"
          id="contactEmail"
          v-model="registerFormData.contactEmail"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
    </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe <span style="color: red;">*</span></label>
        <input
          type="password"
          id="password"
          v-model="registerFormData.password"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
      </div>

      <div class="mb-4">
        <label for="contactPhone" class="block text-sm font-medium text-gray-700">Numéro de téléphone<span style="color: red;">*</span></label>
        <input
          type="tel"
          id="contactPhone"
          v-model="registerFormData.contactPhone"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
      </div>

      <div class="mb-4">
        <label for="confirmationRedirectUrl" class="block text-sm font-medium text-gray-700">Url de confirmation<span style="color: red;">*</span></label>
        <input
          type="text"
          id="confirmationRedirectUrl"
          v-model="registerFormData.confirmationRedirectUrl"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
      </div>

      <div class="mb-4">
        <label for="cancellationRedirectUrl" class="block text-sm font-medium text-gray-700">Url d'annulation<span style="color: red;">*</span></label>
        <input
          type="text"
          id="cancellationRedirectUrl"
          v-model="registerFormData.cancellationRedirectUrl"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
      </div>

      <div class="mb-4">
        <label for="currency" class="block text-sm font-medium text-gray-700">Devise<span style="color: red;">*</span></label>
        <select
          id="currency"
          v-model="registerFormData.currency"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="EUR" selected>EUR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div class="mb-4">
        <label for="domain" class="block text-sm font-medium text-gray-700">Domaine <span style="color: red;">*</span></label>
        <input
            type="text"
            id="domain"
            v-model="registerFormData.domain"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

    <div class="mb-4">
      <label for="lastname" class="block text-sm font-medium text-gray-700">Nom <span style="color: red;">*</span></label>
      <input
          type="text"
          id="lastname"
          v-model="registerFormData.lastname"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

    <div class="mb-4">
      <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom <span style="color: red;">*</span></label>
      <input
          type="text"
          id="firstname"
          v-model="registerFormData.firstname"
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>

      <button
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        type="submit"
      >
        C'est parti !
      </button>

  </form>
</template>
