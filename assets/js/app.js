let pwa = new Vue({
  el: '#pwa',
  data: {
    students: []
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
        headers: { "Content-Type": "application/json" }
      }

      const response = await fetch("http://127.0.0.1:5984/pwa-etudiant/_all_docs?include_docs=true", requestOptions);
      const data = await response.json();
      const rows = data.rows;

      rows.forEach(row => {
        this.showStudent(row["id"])
      });
    },

    async showStudent(id) {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      }
      
      const response = await fetch(`http://127.0.0.1:5984/pwa-etudiant/${id}`, requestOptions);
      const data = await response.json();

      const student = {
        "nom": data.nom,
        "prenoms": data.prenoms,
        "date_de_naissance": data.date_de_naissance,
        "lieu_de_naissance": data.lieu_de_naissance,
        "adresse": data.adresse,
        "contact": data.contact,
        "couriel": data.couriel
      }

      this.students.push(student);

      console.log(data.nom);
    }
  },
  mounted() {

  },
  created() {
    this.showAllStudent();
  }
});