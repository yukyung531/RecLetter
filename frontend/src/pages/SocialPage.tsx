import { useEffect } from "react";
import { httpStatusCode } from "../util/http-status";
import { useNavigate } from "react-router-dom";

export default function SocialPage() {
  const navigator = useNavigate();
  useEffect(() => {
    const urlStr = window.location.href;
    const url = new URL(urlStr);

    const urlparams = url.searchParams;

    const param = urlparams.getAll();

    getSocialAPI();
  }, []);

  const getSocialAPI = async () => {
    await Axios().then((res) => {
      if (res.state === httpStatusCode.OK) {
        localStorage.setItem("access-token", "aa");
        localStorage.setItem("refresh-token", "bb");
        localStorage.setItem("is-login", "true");
        navigator("/login");
      }
    });
  };

  return <></>;
}
