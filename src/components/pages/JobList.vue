<template>
    <v-container fluid>
        <v-row justify="center" sm="12">
            <v-col cols="12">
                <h1>
                    <v-btn icon large @click="goHome">
                        <v-icon>mdi-keyboard-backspace</v-icon>
                    </v-btn>
                    My Jobs
                </h1>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "job-list",
        components: {},
        methods: {
            goHome() {
                this.$router.push({
                    name: "home",
                });
            },
        },
        created: function () {},
    };
</script>
