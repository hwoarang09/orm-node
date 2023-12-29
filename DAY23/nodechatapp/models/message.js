module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "channel_msg",
    {
      channel_msg_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: "로깅고유번호",
      },
      channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "채널고유번호",
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "사용자고유번호",
      },
      nick_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "채팅닉네임",
      },
      msg_type_code: {
        type: DataTypes.TINYINT,
        allowNull: false,
        comment: "로깅유형코드",
      },
      connection_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "채팅고유커넥션아이디",
      },
      message: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        comment: "원본채팅메세지",
      },
      ip_address: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "IP주소",
      },
      top_channel_msg_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "최상위메세지고유번호",
      },
      msg_state_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "메세지 상태코드",
      },
      msg_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "등록일시",
      },
      edit_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "수정일시",
      },
      del_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "삭제일시",
      },
    },
    {
      sequelize,
      tableName: "channel_msg", //이게 찐 테이블명
      timestamps: false,
      comment: "채널채팅이력정보",
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "channel_msg_id" }], //여러개의 컬럼이 프라미어리 키인경우 차가하여 설정가능
        },
      ],
    }
  );
};
