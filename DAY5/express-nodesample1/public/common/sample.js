function fnValidation() {
  if (document.getElementById("email").value === "") {
    alert("emaiil을 입력하세요.");
    document.getElementById("email").focus();
    preventDefault();
    return false;
  }
  if (document.getElementById("password").value === "") {
    alert("password을 입력하세요.");
    document.getElementById("password").focus();
    preventDefault();
    return false;
  }
  if (document.getElementById("name").value === "") {
    alert("name을 입력하세요.");
    document.getElementById("name").focus();
    preventDefault();
    return false;
  }
  return true;
}
