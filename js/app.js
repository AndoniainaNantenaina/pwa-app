var pwa = new Vue({
  el: '#pwa',
  data: {
    test: 'Our PWA-APP'
  },
  methods: {
    async addStudent() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: this.$refs.last_name.value,
          prenoms: this.$refs.first_name.value,
          date_de_naissance: this.$refs.date.value,
          lieu_de_naissance: this.$refs.lieu.value,
          adresse: this.$refs.adresse.value,
          contact: this.$refs.contact.value,
          couriel: this.$refs.mail.value,
        })
      };
      const response = await fetch("http://127.0.0.1:5984/pwa-etudiant", requestOptions);
    },

    async showAllStudent() {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        
      }
      const response = await fetch("http://127.0.0.1:5984/pwa-etudiant/_all_docs?include_docs=true", requestOptions);
      const data = await response.json();
      const rows = data.rows;

      rows.forEach(row => {
        console.log(row["value"]);
      });
    }
  }
})