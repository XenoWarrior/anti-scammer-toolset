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
          <v-btn block color="primary" dark @click="exportFile()"
            >Export File</v-btn
          >
        </v-col>
      </v-row>

      <v-row v-if="this.generatedData" justify="center" cols="12">
        <v-col sm="10">
          <v-btn block color="primary" dark @click="westaKrSpammer()"
            >Spam WestaKR</v-btn
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
                  <h4>NatWest (UK)</h4>
                </v-col>
                <v-col sm="12" dense>
                  NatWest Customer Number:
                  <code>{{
                    this.typeMapping["banking.natwestCustomerNumber"]()
                  }}</code>
                </v-col>
                <v-col sm="12" dense>
                  NatWest Password:
                  <code>{{
                    this.typeMapping["banking.natwestPassword"]()
                  }}</code>
                </v-col>

                <v-col sm="12" dense>
                  <h4>RBS (UK)</h4>
                </v-col>
                <v-col sm="12" dense>
                  RBS Customer Number:
                  <code>{{
                    this.typeMapping["banking.rbsCustomerNumber"]()
                  }}</code>
                </v-col>
                <v-col sm="12" dense>
                  RBS Password:
                  <code>{{ this.typeMapping["banking.rbsPassword"]() }}</code>
                </v-col>

                <v-col sm="12" dense>
                  <h4>TSB (UK)</h4>
                </v-col>
                <v-col sm="12" dense>
                  TSB User ID:
                  <code>{{ this.typeMapping["banking.tsbUserID"]() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  TSB Password:
                  <code>{{ this.typeMapping["banking.tsbPassword"]() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  TSB Memorable Word:
                  <code>{{
                    this.typeMapping["banking.tsbMemorableWord"]()
                  }}</code>
                </v-col>
                <v-col sm="12" dense>
                  TSB Memorable Character 1:
                  <code>{{
                    this.typeMapping["banking.tsbMemorableCharacter"]()
                  }}</code>
                </v-col>
                <v-col sm="12" dense>
                  TSB Memorable Character 2:
                  <code>{{
                    this.typeMapping["banking.tsbMemorableCharacter"]()
                  }}</code>
                </v-col>
                <v-col sm="12" dense>
                  TSB Memorable Character 3:
                  <code>{{
                    this.typeMapping["banking.tsbMemorableCharacter"]()
                  }}</code>
                </v-col>
                <v-col sm="12" dense>
                  TSB One Time Password:
                  <code>{{
                    this.typeMapping["banking.tsbOneTimePassword"]()
                  }}</code>
                </v-col>

                <v-col sm="12" dense>
                  <h4>Banking (USA)</h4>
                </v-col>
                <v-col sm="12" dense>
                  Bank of America Online ID
                  <code>{{
                    this.typeMapping["banking.bankOfAmericaOnlineID"]()
                  }}</code>
                </v-col>

                <v-col sm="12" dense>
                  <h4>Form Padding</h4>
                </v-col>
                <v-col sm="12" dense>
                  Form Image X
                  <code>{{ this.typeMapping["padding.FormImageX"]() }}</code>
                </v-col>
                <v-col sm="12" dense>
                  Form Image Y
                  <code>{{ this.typeMapping["padding.FormImageY"]() }}</code>
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
      exportableFile: "",

      useDelimiter: null,
      useEncoding: null,
      useQuotes: null,

      generator: Fakerator(),

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
        "contact.ukMobile": () => {
          let type = this.generator.random.number(1, 3);
          let loop = 8;
          let number = "";

          switch (type) {
            case 1:
              number += "07";
              break;
            case 2:
              number += "+447";
              break;
            case 3:
              number += "+44 7";
              break;
          }
          for (let i = 0; i <= loop; i++) {
            number += `${this.generator.random.digit()}`;
          }

          return number;
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
          let date = this.generator.date.past(60, new Date());
          let day = date.getDate();
          let month =
            date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
          let year = date.getFullYear().toString().substr(-2);
          let discriminator = `${this.generator.random.digit()}${this.generator.random.digit()}${this.generator.random.digit()}`;

          return `${day}${month}${year}${discriminator}`;
        },
        "banking.natwestPassword": () => {
          // Requirements:
          // * Your Online Banking password must have between 6 and 20 characters, and contain both letters and numbers.
          // * We won't accept: hyphens, punctuation marks, or spaces
          // * We won't accept: special characters such as @ or £
          let password = this.generator.internet.password(
            this.generator.random.number(6, 20)
          );
          password = password.replace(/[^a-zA-Z ]/g, "");

          if (password.length < 6) {
            console.log(
              "Password is less than 6 characters after removing special characters. Adding some randomness."
            );
            while (password.length < 6) {
              if (this.generator.random.boolean()) {
                password += `${this.generator.random.digit()}`;
              } else {
                password += `${this.generator.random.letter()}`;
              }
            }
          }

          return password;
        },

        "banking.rbsCustomerNumber": () => {
          // proxy - the values are the same
          return this.typeMapping["banking.natwestCustomerNumber"]();
        },
        "banking.rbsPassword": () => {
          // proxy - the values are the same
          return this.typeMapping["banking.natwestPassword"]();
        },

        "banking.tsbUserID": () => {
          return this.generator.internet.userName(
            this.generator.names.firstName(),
            this.generator.names.lastName()
          );
        },
        "banking.tsbPassword": () => {
          // proxy - the values are the same
          return this.typeMapping["banking.natwestPassword"]();
        },
        "banking.tsbMemorableWord": () => {
          let type = this.generator.random.number(1, 3);
          switch (type) {
            case 1:
              return this.generator.lorem.word();
            case 2:
              return this.generator.names.firstName();
            case 3:
              return this.generator.names.lastName();
            case 4:
              return this.generator.address.streetName();
          }
        },
        "banking.tsbMemorableCharacter": () => {
          // &nbsp; for the specific target I am looking to spam
          if (this.generator.random.boolean()) {
            return `&nbsp;${this.generator.random.letter()}`;
          } else {
            return `&nbsp;${this.generator.random.letter().toUpperCase()}`;
          }
        },
        "banking.tsbOneTimePassword": () => {
          return `${this.generator.random.digit()}${this.generator.random.digit()}${this.generator.random.digit()}${this.generator.random.digit()}${this.generator.random.digit()}${this.generator.random.digit()}`;
        },

        // Payload Padding
        "padding.FormImageX": () => {
          return this.generator.random.number(0, 120);
        },

        "padding.FormImageY": () => {
          return this.generator.random.number(0, 60);
        },

        // Banking Logins (USA)
        "banking.bankOfAmericaOnlineID": () => {
          // TODO: generate a random "custom" user inputted username.
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
        { text: "JSON", value: "json" },
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

        { text: "NatWest", disabled: true },
        {
          text: `NatWest: Customer Number`,
          value: "banking.natwestCustomerNumber",
          disabled: false,
        },
        {
          text: `NatWest: Password`,
          value: "banking.natwestPassword",
          disabled: false,
        },

        { text: "RBS", disabled: true },
        {
          text: `RBS: Customer Number`,
          value: "banking.rbsCustomerNumber",
          disabled: false,
        },
        {
          text: `RBS: Password`,
          value: "banking.rbsPassword",
          disabled: false,
        },

        { text: "TSB", disabled: true },
        {
          text: `TSB: Customer Number`,
          value: "banking.tsbUserID",
          disabled: false,
        },
        {
          text: `TSB: Password`,
          value: "banking.tsbPassword",
          disabled: false,
        },
        {
          text: `TSB: Memorable Word`,
          value: "banking.tsbMemorableWord",
          disabled: false,
        },
        {
          text: `TSB: Memorable Character`,
          value: "banking.tsbMemorableCharacter",
          disabled: false,
        },
        {
          text: `TSB: One Time Password`,
          value: "banking.tsbOneTimePassword",
          disabled: false,
        },

        { text: "Payload Data (Padding)", disabled: true },
        {
          text: `Form Image X`,
          value: "padding.FormImageX",
          disabled: false,
        },
        {
          text: `Form Image Y`,
          value: "padding.FormImageY",
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
          text: `Mobile Number (UK)`,
          value: "contact.ukMobile",
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
    //TODO: move spammer logic out of here and make it configurable, every scam website is different.
    async westaKrSpammer() {
      this.generatedData.forEach((item) => {
        console.log(item);
      });

      let initialGet = await fetch(
        "https://westa.kr/eyoom/misc/tsb/Login.php?sslchannel=true&form=AccountVerification",
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
            "sec-ch-ua":
              '"Chromium";v="92", " Not A;Brand";v="99", "Microsoft Edge";v="92"',
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );
      console.log(initialGet);
    },
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
    exportFile() {
      let ext = "";
      this.generatedData = [];

      for (let i = 0; i < this.rowsToExport; i++) {
        let row = {};

        this.csvColumns.forEach((column) => {
          row[column.name] = this.typeMapping[column.type]();
        });

        this.generatedData.push(row);
      }

      let parser = new Parser({
        fields: this.exportHeaders,
        quote: `${this.useQuotes ? '"' : ""}`,
        delimiter: this.useDelimiter,
        encoding: this.useEncoding,
      });

      switch (this.useEncoding) {
        case "utf8":
          this.exportableFile = encodeURIComponent(
            parser.parse(this.generatedData)
          );
          ext = "csv";
          break;
        case "utf16":
          this.exportableFile = this.strEncodeUTF16(
            parser.parse(this.generatedData)
          );
          ext = "csv";
          break;
        case "json":
          this.exportableFile = JSON.stringify(this.generatedData);
          ext = "json";
          break;
        default:
          this.exportableFile = JSON.stringify(this.generatedData);
          ext = "json";
          break;
      }

      var exportable = document.createElement("a");
      exportable.href = "data:attachment/text," + this.exportableFile;
      exportable.target = "_blank";
      exportable.download = `Exported.${ext}`;
      exportable.click();

      exportable.remove();
    },
  },
  created() {},
};
</script>
