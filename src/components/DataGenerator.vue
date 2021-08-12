<template>
  <v-container>
    <template>
      <v-row justify="center" cols="10">
        <v-col sm="10" dense>
          <h3>CSV Configuration</h3>
        </v-col>
      </v-row>
    </template>

    <template>
      <v-row justify="center" cols="12">
        <v-col sm="5">
          <v-select
            v-model="useDelimiter"
            :items="delimiters"
            filled
            label="Delimiter"
          ></v-select>
        </v-col>
        <v-col sm="5">
          <v-select
            v-model="useEncoding"
            :items="encodings"
            filled
            label="Encoding"
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" cols="12">
        <v-col sm="10">
          <v-select
            v-model="useQuotes"
            :items="quotes"
            filled
            label="Surround Data in Quotes"
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" cols="12">
        <v-col sm="10">
          <v-text-field
            v-model="rowsToExport"
            type="number"
            filled
            label="Number of records to generate"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>

    <template>
      <v-row justify="center" cols="10">
        <v-col sm="8" dense>
          <h3>
            Columns
            <v-btn @click="addColumn()" color="success" icon>
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </h3>
        </v-col>
        <v-col sm="2" dense>
          <v-btn block color="primary" dark @click.stop="dialog = true"
            >View Examples</v-btn
          >
        </v-col>
      </v-row>
    </template>
    <template v-if="csvColumns && csvColumns.length > 0">
      <v-row
        justify="center"
        v-for="column in csvColumns"
        :key="column.id"
        sm="12"
      >
        <v-col sm="3">
          <v-text-field
            @change="setColumnName(column.id, $event)"
            filled
            label="Column Name"
          ></v-text-field>
        </v-col>
        <v-col sm="5">
          <v-select
            @change="setColumnType(column.id, $event)"
            :items="items"
            filled
            label="Column Type"
          ></v-select>
        </v-col>
        <v-col sm="2">
          <v-btn block height="56" @click="removeColumn(column.id)">
            <v-icon color="red" left>mdi-minus-circle</v-icon>Remove
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center" cols="12">
        <v-col sm="10">
          <v-btn block color="primary" dark @click="generateCsv()"
            >Generate CSV</v-btn
          >
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row justify="center" cols="12">
        <v-col sm="10">
          <v-alert type="info">Add a column by clicking the + button</v-alert>
        </v-col>
      </v-row>
    </template>

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title class="headline">Examples</v-card-title>
            <v-card-text>
              <v-row cols="12" dense>
                <v-col sm="12" dense>
                  <h4>Name</h4>
                </v-col>
                <v-col sm="12" dense>
                  Prefix:
                  <code>{{ generator.names.prefix() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  First Name:
                  <code>{{ generator.names.firstName() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Last Name:
                  <code>{{ generator.names.lastName() }}</code>
                </v-col>

                <v-col sm="12" dense>
                  <h4>Customer</h4>
                </v-col>
                <v-col sm="12" dense>
                  House Number:
                  <code>{{ generator.address.buildingNumber() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Street:
                  <code>{{ generator.address.street() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  City:
                  <code>{{ generator.address.city() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Postcode:
                  <code>{{ generator.address.postCode() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Country:
                  <code>{{ generator.address.country() }}</code>
                </v-col>

                <v-col sm="12" dense>
                  <h4>Banking (UK)</h4>
                </v-col>
                <v-col sm="12" dense>
                  NatWest Customer Number:
                  <code>{{ this.typeMapping["banking.natwestCustomerNumber"]() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  TSB User ID:
                  <code>{{ this.typeMapping["banking.tsbUserID"]() }}</code>
                </v-col>
                
                <v-col sm="12" dense>
                  <h4>Banking (USA)</h4>
                </v-col>
                <v-col sm="12" dense>
                  Bank of America Online ID
                  <code>{{ this.typeMapping["banking.bankOfAmericaOnlineID"]() }}</code>
                </v-col>

                <v-col sm="12" dense>
                  <h4>Contact</h4>
                </v-col>
                <v-col sm="12" dense>
                  Mobile Number:
                  <code>{{ generator.phone.number() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Landline Number:
                  <code>{{ generator.phone.number() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Email Address:
                  <code>{{ generator.internet.email() }}</code>
                </v-col>

                <v-col sm="12" dense>
                  <h4>Random</h4>
                </v-col>
                <v-col sm="12" dense>
                  Random Number:
                  <code>{{ generator.random.digit() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Random String:
                  <code>{{ generator.random.letter() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Random UUID:
                  <code>{{ generator.misc.uuid() }}</code>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </v-container>
</template>

<script>
const { Parser } = require("json2csv");
const Fakerator = require("fakerator");

export default {
  name: "HelloWorld",
  data() {
    return {
      csvColumns: [],

      dialog: false,
      rowsToExport: null,
      generatedData: [],
      csvFile: "",

      useDelimiter: null,
      useEncoding: null,
      useQuotes: null,

      generator: Fakerator("en-GB"),

      typeMapping: {
        // Personal Names
        "names.prefix": () => {
          return this.generator.names.prefix();
        },
        "names.firstName": () => {
          return this.generator.names.firstName();
        },
        "names.lastName": () => {
          return this.generator.names.lastName();
        },

        // Home Addresses
        "address.buildingNumber": () => {
          return this.generator.address.buildingNumber();
        },
        "address.street": () => {
          return this.generator.address.street();
        },
        "address.city": () => {
          return this.generator.address.city();
        },
        "address.postCode": () => {
          return this.generator.address.postCode();
        },
        "address.country": () => {
          return this.generator.address.country();
        },

        // Contact Details
        "contact.mobile": () => {
          return this.generator.phone.number();
        },
        "contact.landline": () => {
          return this.generator.phone.number();
        },
        "contact.email": () => {
          return this.generator.internet.email();
        },

        // Random
        "random.randDigit": () => {
          return this.generator.random.letter();
        },
        "random.randLetter": () => {
          return this.generator.random.digit();
        },

        // Misc
        "misc.uuid": () => {
          return this.generator.misc.uuid();
        },

        // Banking Logins (UK)
        "banking.natwestCustomerNumber": () => {
          return "hello, world";
        },
        "banking.tsbUserID": () => {
          return "hello, world";
        },

        // Banking Logins (USA)
        "banking.bankOfAmericaOnlineID": () => {
          return "hello, world";
        },
      },

      delimiters: [
        { text: "Tab", value: "\t" },
        { text: "Comma", value: "," },
        { text: "Semicolon", value: ";" },
      ],
      encodings: [
        { text: "UTF-8", value: "utf8" },
        { text: "UTF-16", value: "utf16" },
      ],
      quotes: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],

      items: [
        { text: "Name", disabled: true },
        {
          text: `Prefix`,
          value: "names.prefix",
          disabled: false,
        },
        {
          text: `First Name`,
          value: "names.firstName",
          disabled: false,
        },
        {
          text: `Last Name`,
          value: "names.lastName",
          disabled: false,
        },

        { text: "Banking", disabled: true },
        {
          text: `NatWest: Customer Number`,
          value: "banking.natwestCustomerNumber",
          disabled: false,
        },
        {
          text: `Bank of America: Online ID`,
          value: "banking.bankOfAmericaOnlineID",
          disabled: false,
        },

        { text: "Address", disabled: true },
        {
          text: `House Number`,
          value: "address.buildingNumber",
          disabled: false,
        },
        {
          text: `Street`,
          value: "address.street",
          disabled: false,
        },
        {
          text: `City`,
          value: "address.city",
          disabled: false,
        },
        {
          text: `Postcode`,
          value: "address.postCode",
          disabled: false,
        },
        {
          text: `Country`,
          value: "address.country",
          disabled: false,
        },
        { text: "Contact", disabled: true },
        {
          text: `Mobile Number`,
          value: "contact.mobile",
          disabled: false,
        },
        {
          text: `Landline Number`,
          value: "contact.landline",
          disabled: false,
        },
        {
          text: `Email Address`,
          value: "contact.email",
          disabled: false,
        },
        { text: "Random", disabled: true },
        {
          text: `Random Number`,
          value: "random.randDigit",
          disabled: false,
        },
        {
          text: `Random String`,
          value: "random.randLetter",
          disabled: false,
        },
        {
          text: `Random UUID`,
          value: "misc.uuid",
          disabled: false,
        },
      ],

      columnIncrement: 0,
    };
  },
  computed: {
    exportHeaders() {
      let headers = [];

      this.csvColumns.forEach((column) => {
        headers.push(column.name);
      });

      return headers;
    },
  },
  methods: {
    addColumn() {
      this.csvColumns.push({
        id: this.columnIncrement,
        name: "",
        type: "",
      });

      this.columnIncrement++;
    },
    removeColumn(id) {
      this.csvColumns = this.csvColumns.filter((item) => {
        return item.id != id;
      });
    },
    setColumnName(id, event) {
      this.csvColumns[id].name = event;
      console.log("Set name", id, event);
    },
    setColumnType(id, event) {
      this.csvColumns[id].type = event;
      console.log("Set type", id, event);
    },
    strEncodeUTF16(str) {
      var buf = new ArrayBuffer(str.length * 2);
      var bufView = new Uint16Array(buf);
      for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return bufView;
    },
    generateCsv() {
      this.generatedData = [];

      for (let i = 0; i < this.rowsToExport; i++) {
        let row = {};

        this.csvColumns.forEach((column) => {
          row[column.name] = this.typeMapping[column.type]();
        });

        console.log("Export", row);
        this.generatedData.push(row);
      }

      console.log("Output data", this.generatedData);

      let parser = new Parser({
        fields: this.exportHeaders,
        quote: `${this.useQuotes ? '"' : ""}`,
        delimiter: this.useDelimiter,
        encoding: this.useEncoding,
      });

      this.csvFile = parser.parse(this.generatedData);

      switch (this.useEncoding) {
        case "utf8":
          this.csvFile = encodeURIComponent(this.csvFile);
          break;
        case "utf16":
          this.csvFile = this.strEncodeUTF16(this.csvFile);
          break;
        default:
          break;
      }

      var exportable = document.createElement("a");
      exportable.href = "data:attachment/text," + this.csvFile;
      exportable.target = "_blank";
      exportable.download = "Exported.csv";
      exportable.click();

      exportable.remove();
    },
  },
  created() {},
};
</script>
