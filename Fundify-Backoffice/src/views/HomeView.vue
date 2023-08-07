<template>
  <div class="flex flex-col justify-between" :style="{ minHeight: 'calc(100vh - 4rem)' }">
    <!-- Main Content -->
    <main>
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Simplifiez vos paiements
        </h2>
        <p class="mt-4 text-lg leading-6 text-gray-500">
          Avec notre application, la gestion de vos transactions n'a jamais été aussi facile. Inscrivez-vous aujourd'hui et commencez à profiter des avantages.
        </p>
        <div class="mt-10 sm:flex sm:justify-center">
          <div class="rounded-md shadow">
            <router-link to="/dashboard" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              Commencer maintenant
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full p-6 bg-white shadow-md">
      <p class="text-center text-sm text-gray-500">
        © 2023 Fundify Tous les droits sont réservés.
      </p>
    </footer>
  </div>
</template>
