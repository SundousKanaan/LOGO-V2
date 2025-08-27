import { Dialog, Portal, CloseButton, Button } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

function Popup({
  title,
  isOpen,
  onClose,
  onSave,
  disableSaveButton,
  withoutButtons = false,
  ActionButtonText = "Save",
  children,
}) {

  const handleOnSave = async () => {
    if (disableSaveButton) return;
    await Haptics.impact({ style: ImpactStyle.Heavy });
    onSave();
  };

  return (
    <Dialog.Root open={isOpen} scrollBehavior="outside">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content width="90%">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>{children}</Dialog.Body>

            {!withoutButtons && (
              <Dialog.Footer justifyContent={"space-between"}>
                <Dialog.ActionTrigger asChild>
                  <Button
                    w={convertPx(150)}
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  w={convertPx(150)}
                  bg={"themeColor"}
                  onClick={handleOnSave}
                  disabled={disableSaveButton}
                  textTransform={"capitalize"}
                >
                  {ActionButtonText}
                </Button>
              </Dialog.Footer>
            )}

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default Popup;
