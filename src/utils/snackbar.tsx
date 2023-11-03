

export const snackbar = (
  enqueueSnackbar: any,
  message: string,
  variant: "default" | "error" | "success" | "warning" | "info" | undefined
) => {
  return (
    enqueueSnackbar(message, {
      variant: variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      autoHideDuration: 3200
    })
  )
}
