export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// 이메일 유효성 검사
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return {
      isValid: false,
      message: "이메일을 입력해주세요.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "올바른 이메일 형식이 아닙니다.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// 닉네임 유효성 검사
export const validateNickname = (nickname: string): ValidationResult => {
  if (!nickname) {
    return {
      isValid: false,
      message: "닉네임을 입력해주세요.",
    };
  }

  if (nickname.length < 2) {
    return {
      isValid: false,
      message: "닉네임은 2자 이상이어야 합니다.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "비밀번호는 8자 이상이어야 합니다.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// 비밀번호 확인 검사
export const validatePasswordConfirm = (
  password: string,
  passwordConfirm: string,
): ValidationResult => {
  if (password !== passwordConfirm) {
    return {
      isValid: false,
      message: "비밀번호가 일치하지 않습니다.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
