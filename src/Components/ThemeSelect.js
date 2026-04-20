import { Switch } from "antd";
import React, { useEffect, useState } from "react";

const ThemeSelect = () => {
  const theme = localStorage.getItem("theme");
  const [themeMode, setThemeMode] = useState(theme ? theme : "light");

  const onChangeHeaderDark = (checked) => {
    document.body.classList.remove("light");
    const checkedValue = checked ? "dark" : "light";
    setThemeMode(checkedValue);
    localStorage.setItem("theme", checkedValue);
  };

  useEffect(() => {
    if (themeMode == "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, [themeMode]);

  return (
    <>
      <p>{"Light"}</p>
      <Switch
        checked={themeMode == "dark" ? true : false}
        onChange={(value) => {
          onChangeHeaderDark(value);
        }}
      />
      <p>{"Dark"}</p>
    </>
  );
};

export default ThemeSelect;
