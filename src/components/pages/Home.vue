<template>
    <v-container fluid>
        <v-row justify="center" sm="12">
            <v-col cols="12">
                <h1>
                    <v-btn disabled icon large>
                        <v-icon>mdi-home</v-icon>
                    </v-btn>
                    Home
                </h1>
            </v-col>
        </v-row>
        <v-row cols="12">
            <v-col sm="6">
                <v-hover v-slot:default="{ hover }">
                    <v-card
                        :class="{ 'on-hover': hover }"
                        :elevation="hover ? 16 : 2"
                    >
                        <v-img
                            @click="createJob"
                            src="https://via.placeholder.com/350x150"
                            class="white--text align-end"
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            style="cursor: pointer"
                            height="222px"
                        >
                            <v-card-title>Create Job</v-card-title>
                        </v-img>

                        <v-card-actions>
                            <span>Create a new job.</span>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>mdi-link</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-hover>
            </v-col>
            <v-col sm="6">
                <v-hover v-slot:default="{ hover }">
                    <v-card
                        :class="{ 'on-hover': hover }"
                        :elevation="hover ? 16 : 2"
                    >
                        <v-img
                            @click="viewJobs"
                            src="https://via.placeholder.com/350x150"
                            class="white--text align-end"
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            style="cursor: pointer"
                            height="222px"
                        >
                            <v-card-title>My Jobs</v-card-title>
                        </v-img>

                        <v-card-actions>
                            <span
                                >View, edit and run previously defined
                                jobs.</span
                            >
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>mdi-link</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>

        <v-row cols="12" align="center">
            <v-col sm="12" align="center">
                <v-btn @click="dataGenerator" color="primary">Data Generator</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "spaces",
        data() {
            return {
                spaces: [],
            };
        },
        methods: {
            createJob() {
                this.$router
                    .push({
                        name: "job-create",
                    })
                    .catch(() => {
                        console.log("Already on page.");
                    });
            },
            viewJobs() {
                this.$router
                    .push({
                        name: "job-list",
                    })
                    .catch(() => {
                        console.log("Already on page.");
                    });
            },
            dataGenerator() {
                this.$router
                    .push({
                        name: "data-generator",
                    })
                    .catch(() => {
                        console.log("Already on page.");
                    });
            },
        },
        created: function () {},
    };
</script>
