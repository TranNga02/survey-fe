import Swal from "sweetalert2";

export default class SwalPopup {
  public static swalResultPopup(title: string, type: string | any): void {
    Swal.fire({
      text: `${title}`,
      icon: type,
      buttonsStyling: false,
      focusConfirm: false,
      confirmButtonText: "Ok, got it!",
      // customClass: {
      //   confirmButton: "btn btn-green p-3",
      // },
    });
  }

  public static swalDeletePopup(
    title: string,
    callback: { onConfirmed?: () => void; onCanceled?: () => void },
    options: {
      confirmButtonText?: string;
      cancelButtonText?: string;
    } | null = null
  ): void {
    Swal.fire({
      text: `${title}`,
      icon: "warning",
      buttonsStyling: false,
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonText: options?.confirmButtonText || "Yes, delete!",
      cancelButtonText: options?.cancelButtonText || "No, cancel",
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (callback.onConfirmed) callback.onConfirmed();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (callback.onCanceled) callback.onCanceled();
      }
    });
  }

  public static swalChangePopup(
    title: string,
    callback: { onConfirmed?: () => void; onCanceled?: () => void },
    options: {
      confirmButtonText?: string;
      cancelButtonText?: string;
    } | null = null
  ): void {
    Swal.fire({
      text: `${title}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: options?.confirmButtonText || "Yes, change it!",
      cancelButtonText: options?.cancelButtonText || "No, return",
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (callback.onConfirmed) callback.onConfirmed();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (callback.onCanceled) callback.onCanceled();
      }
    });
  }

  public static swalPopup(
    title: string,
    options: {
      confirmButtonText?: string;
      cancelButtonText?: string;
      callback: { onConfirmed?: () => void; onCanceled?: () => void };
    } | null = null
  ): void {
    Swal.fire({
      text: `${title}`,
      icon: "warning",
      buttonsStyling: false,
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonText: options?.confirmButtonText || "Yes, delete!",
      cancelButtonText: options?.cancelButtonText || "No, cancel",
      // customClass: {
      //   confirmButton: "btn btn-danger",
      //   cancelButton: "btn btn-light btn-active-light-primary",
      // },
    }).then((result: any) => {
      if (result.isConfirmed) {
        if (options?.callback.onConfirmed) options?.callback.onConfirmed();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (options?.callback.onCanceled) options?.callback.onCanceled();
      }
    });
  }
}
