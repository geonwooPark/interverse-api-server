import * as yup from "yup";

export const CreateUserSchema = yup.object({
  email: yup
    .string()
    .required("이메일을 입력해주세요.")
    .email("잘못된 이메일 형식입니다."),
  password: yup
    .string()
    .required("비밀번호를 입력해주세요.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/,
      "비밀번호는 영문을 포함하여 8~15자리이어야 합니다."
    ),
  nickname: yup
    .string()
    .required("이름을 입력해주세요.")
    .max(10, "이름은 10자 이하로 입력해주세요."),
});

export const LoginSchema = yup.object({
  email: yup
    .string()
    .email("유효한 이메일을 입력해주세요.")
    .required("이메일을 입력해주세요."),
  password: yup
    .string()
    .required("비밀번호를 입력해주세요.")
    .min(8, "비밀번호는 최소 8자리 이상이어야 합니다."),
});
