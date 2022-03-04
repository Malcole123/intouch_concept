import HTML2PDF from "./html2pdf";
import Screenshot from "./screenshot";
export { HTML2PDF, Screenshot };
declare const _default: {
    /** Create a new HTML to PDF API Client with supplied user access token */
    html2pdf: (accessToken: String) => HTML2PDF;
    /** Create a new Screenshot Client with supplied user access token */
    screenshot: (accessToken: String) => Screenshot;
};
export default _default;
