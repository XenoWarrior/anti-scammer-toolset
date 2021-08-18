<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center">
                Anti Scammer Toolset
            </div>
        </v-app-bar>

        <v-main>
            <DataGenerator />
        </v-main>
    </v-app>
</template>

<script>
import DataGenerator from "./components/DataGenerator";

export default {
    name: "App",

    components: {
        DataGenerator,
    },

    data: () => ({
        //
    }),
};
</script>
