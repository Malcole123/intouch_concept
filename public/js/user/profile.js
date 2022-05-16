const changeDetails = new Vue({
  el: "#editProfileInfo",
  data: {
    fname: "",
    lname: "",
    email: "",
    phone: "",
    changed: false,
    password:""
  },
  methods: {
    changeDetails: async () => {
      var res = await fetch("/me/edit/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "details",
          fname: changeDetails.fname,
          lname: changeDetails.lname,
          email: changeDetails.email,
          phone: changeDetails.phone,
          old_password:changeDetails.password,
          new_password:""
        }),
      })
        .then((res) => res.json())
        .then(data=>{
          console.log(data)
        }).catch((error) => {
          console.log(error);
        });
    },
    changeDetect: () => {
      changeDetails.changed = true;
    },
  },
});


