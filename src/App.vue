<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div @click="goHome" class="d-flex align-center">
                Anti Scammer Toolset
            </div>
        </v-app-bar>

        <v-main>
            <v-main>
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </v-main>
        </v-main>
    </v-app>
</template>

<script>
    export default {
        name: "App",

        components: {},

        methods: {
            goHome() {
                this.$router.push({
                    name: "home",
                });
            },
        },

        data: () => ({
            //
        }),
    };
</script>
