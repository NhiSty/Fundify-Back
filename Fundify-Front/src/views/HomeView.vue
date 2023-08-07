<script setup>
import { ref } from 'vue';

const id = ref('');
const clientToken = ref('');
const amount = ref('');

const setCookie = (name, value, min) => {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + min * 60 * 1000);
  const cookieValue = encodeURIComponent(value) + (min ? `; expires=${expirationDate.toUTCString()}` : '');
  document.cookie = `${name}=${cookieValue}; path=/; secure; SameSite=strict`;
};


// On submit, make a post request to the server
const submit = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Bearer': `${id.value}:${clientToken.value}`,
        'credentials': 'include',
      },
      body: JSON.stringify({
        id: id.value,
        merchantId: id.value,
        amount: amount.value,
        userId: "e6c834bc-2597-4689-866e-85bd687ef13f",
        currency: 'USD',
      }),
    });
    const data = await response.json();
    console.log(data);
    setCookie('clientSecret', data.clientSecret, 60 );

    if (document.cookie.indexOf('clientSecret') === -1) {
    }else{
      window.location.href = data.url
    }

  } catch (error) {
    console.log(error);
  }
};

</script>

<template>
  <main>
    <v-form>
      <v-text-field
        v-model="id"
        label="Id"
        type="text"
        placeholder="3d8047b9-9cc1-407a-861a-bd1b48595b5d"
        required
      ></v-text-field>
      <v-text-field
        v-model="clientToken"
        label="Client Token"
        type="textarea"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkODA0N2I5LTljYzEtNDA3YS04NjFhLWJkMWI0ODU5NWI1ZCIsIm1lcmNoYW50SWQiOiI4NDE5NjkzMC03N2RjLTQ5MjYtYmM5NC0xMThhNzQ2MTI3OTAiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjkwNDk2MDAxLCJleHAiOjE3MjIwNTM2MDF9.6tA1UK7kfVzV5l8jxiRUTbj_IPeIQSuaFChu6sbC8lg"
        required
      ></v-text-field>
      <v-text-field
        v-model="amount"
        label="Amount"
        type="number"
        min="1"
        required
      ></v-text-field>
      <v-btn
        color="primary"
        @click="submit"
      >
        Submit
      </v-btn>
    </v-form>

    id :839aa47c-444c-4af6-a31b-4e81b75bf834 <br>
    token :u5MRWqCBaTGmSIXHqqFmR0f1jj0u1qMXVVDFCwV8xlvaoTZBZtXjXHYNTHpyCbTaGwh4+128AomFNyaFKEOMgw==
  </main>
</template>
