var imgPath = "";
$("#settings-tab").click(function () {
  var loginUserToken = localStorage.getItem("userauthtoken");

  var loginData = {
    email: $("#email").val(),
    member_password: $("#member_password").val(),
  };

  console.log("loginData : ", loginData);
  $.ajax({
    type: "GET",
    url: "/api/member/profile",
    headers: {
      Authorization: `Bearer ${loginUserToken}`,
    },
    dataType: "json",

    success: function (result) {
      console.log("백엔드호출 API 호출 결과 : ", result);
      if (result.code == 200) {
        $("#member_email").val(result.data.email);
        $("#member_name").val(result.data.name);
        $("#member_telephone").val(result.data.telephone);
        $("#profile_img").attr("src", result.data.profile_img_path);
      }
    },
    error: function (err) {
      console.log("백엔드호출 API 호출 에러 발생 : ", err);
    },
  });
});

//save changes
$("#profile-save-changes").click(async () => {
  console.log("profile save change clicke!!!");
  var loginUserToken = localStorage.getItem("userauthtoken");
  if ($("#member_email").val === "") {
    e.preventDefault();
    await Swal.fire({
      icon: "error",
      title: "변경 실패",
      text: "이메일을 입력해주세요!",
    });
    return false;
  }
  if ($("#member_name").val === "") {
    e.preventDefault();
    await Swal.fire({
      icon: "error",
      title: "변경 실패",
      text: "이름을 입력해주세요!",
    });
    return false;
  }
  if ($("#member_telephone").val === "") {
    e.preventDefault();
    await Swal.fire({
      icon: "error",
      title: "변경 실패",
      text: "전화번호를 입력해주세요!",
    });
    return false;
  }

  var profileData = {
    name: $("#member_name").val(),
    email: $("#member_email").val(),
    telephone: $("#member_telephone").val(),
    profile_img_path: imgPath,
  };

  $.ajax({
    type: "POST",
    url: "/api/member/profileModify",
    headers: {
      Authorization: `Bearer ${loginUserToken}`,
    },
    dataType: "json",
    data: profileData,
    success: async (result) => {
      console.log("백엔드호출 API 호출 결과 : ", result);
      if (result.code == 200) {
        console.log("성공!", result.data);
        localStorage.setItem("userauthtoken", result.data);

        //완료팝업
        Swal.fire({
          position: "center",
          icon: "success",
          title: "정보 변경이 완료되었습니다.",
          showConfirmButton: false,
          didClose: () => {
            location.href = "/main.html";
          },
        });
      }
    },
    error: function (err) {
      console.log("백엔드호출 API 호출 에러 발생 : ", err);
    },
  });
});

//change password
$("#changePassword").click(async (e) => {
  console.log("password change clicke!!!");
  var loginUserToken = localStorage.getItem("userauthtoken");
  const currentPassword = document.getElementById("currentPassword");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  if (currentPassword.value === "") {
    e.preventDefault();
    await Swal.fire({
      icon: "error",
      title: "변경 실패",
      text: "현재 비밀번호를 입력해주세요!",
    });
    return false;
  }
  if (newPassword.value === "") {
    e.preventDefault();
    await Swal.fire({
      icon: "error",
      title: "변경 실패",
      text: "새로운 비밀번호를 입력해주세요!",
    });
    return false;
  }
  if (confirmPassword.value === "") {
    e.preventDefault();
    await Swal.fire({
      icon: "error",
      title: "변경 실패",
      text: "확인용 비밀번호를 입력해주세요.",
    });
    return false;
  }
  if (confirmPassword.value !== newPassword.value) {
    e.preventDefault();
    await Swal.fire({
      icon: "error",
      title: "변경 실패",
      text: "확인용 비밀번호가 새 비민번호와 일치하지 않습니다.",
      didClose: () => {
        confirmPassword.value = "";
        confirmPassword.focus();
      },
    });
    return false;
  }
  var passwordData = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  };
  console.log("passwordData : ", passwordData);
  $.ajax({
    type: "POST",
    url: "/api/member/password/update",
    headers: {
      Authorization: `Bearer ${loginUserToken}`,
    },
    dataType: "json",
    data: passwordData,
    success: async (result) => {
      console.log("백엔드호출 API 호출 결과 : ", result);
      if (result.code == 200) {
        console.log("성공!", result.data);
        localStorage.setItem("userauthtoken", result.data);

        //완료팝업
        Swal.fire({
          position: "center",
          icon: "success",
          title: "비밀번호 변경이 완료되었습니다.",
          showConfirmButton: false,
          didClose: () => {
            location.href = "/main.html";
          },
        });
      } else if (result.code == 400) {
        e.preventDefault();
        await Swal.fire({
          icon: "error",
          title: "변경 실패",
          text: result.resultMsg,
        });
        return false;
      }
    },
    error: function (err) {
      console.log("백엔드호출 API 호출 에러 발생 : ", err);
    },
  });
});

//profile image change
$("#uploadProfile").change(function () {
  console.log("uploadProfile changed!!!!");
  var formData = new FormData();
  var fileInput = document.getElementById("uploadProfile");
  if (fileInput.files[0]) {
    formData.append("file", fileInput.files[0]);
  }
  // 이미지 저장 밎 multer 라우터 호출, 이미지 경로 반환
  $.ajax({
    data: formData,
    type: "POST",
    url: "/api/common/upload",
    cache: false,
    processData: false,
    contentType: false,
    success: function (result) {
      if (result.code == 200) {
        $("#profile_img").attr("src", result.data);
        imgPath = result.data;
        console.log(result.data);
      } else if (result.code == 400) {
        console.log(result.msg);
      } else {
        console.log("이미지 업로드 실패: " + result.msg);
      }
    },
    error: function (err) {
      console.log("이미지 업로드 에러 발생: ", err);
    },
  });
});
