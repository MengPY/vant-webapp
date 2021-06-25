export default {
  fontFamily:"Microsoft YaHei",
  theme: {
    dark:false,
    themes: {
      light: {
        primary: "#561b6f",
      },
      dark: {
        primary: "#561b6f",
      },
    },
  },
  logo: {
    src: "/images/logo.png",
    title:"Vular",
    alt: "An amazing framework",
  },
  drawer: {
    showLogo: false,
    src:"",
    dark:true,
    light:false,
    color:"#672f7e",
    model: true,
    type: 'default (no property)',
    clipped: true,
    floating: false,
    mini: false,
    miniVariantWidth: 70,
    expandOnHover:false,
    logo:{
      color: "#0bb883",
      dark: false,
      flat: true,
      src:"",
      style:"border-bottom:rgba(0,0,0,0.1) solid 1px;"
    },
    fontSize: "0.825rem",
  },
  appbar:{
    logoImage: true,
    logoText: true,
    dark: true,
    light: false,
    color: "#561b6f",
    src: "",
    flat:true,
      style:"border-bottom:rgba(0,0,0,0.1) solid 1px;"
  },
  footer: {
    inset: true,
    color:"",
    dark:false,
    light:false,
    src:"",
  },
  content:{
    fontFamily:"",
    color: "#fbf6f0",
    src: "",
    flat: true,
    card:{
      color:"#ffffff",
      style:"box-shadow: 2px 2px 5px rgba(0,0,0,0.05);",
    }
  },
}