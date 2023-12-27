module.exports = function (sequelize, DataTypes) {
  //sequelize.define은 해당 모델구조를 통해 물리적 테이블을 생성함.
  //인자3개 받음
  //테이블명, 관리항목정의(컬럼),생성옵션
  //이미 있으면 안 만듬.
  return sequelize.define(
    "members",
    {
      member_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, //null을 허용할거냐??member_id는 아니지 무조건 ㅣㅇ성야 함.
        comment: "회원고유번호",
      },
      email: {
        type: DataTypes.STRING(100),
        primaryKey: false,
        allowNull: false,
        comment: "사용자메일주소",
      },
      password: {
        type: DataTypes.STRING(200),
        primaryKey: false,
        allowNull: false,
        comment: "비밀번호",
      },
    },
    {
      timestamps: true,
      paranoid: true, //데이터 삭제하면 실제 테이블에서 진짜 삭제되는 경우도 있고 사용자한테만 안보이고 실제로는 남아있는 경우도 있음
      //삭제된 것 처럼 orm에서는 인식하게 해주는 기능
      //createdAT, updatedAT,deletedAT이 여기에서 만들어지는 듯...?
    }
  );
};
