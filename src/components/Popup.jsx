import { Dialog, Portal, CloseButton, Button } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";

function Popup({ isOpen, onClose, onSave, disableSaveButton, children }) {
  return (
    <Dialog.Root open={isOpen} scrollBehavior="outside">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content width="90%">
            <Dialog.Header>
              <Dialog.Title>New Task</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>{children}</Dialog.Body>

            <Dialog.Footer justifyContent={"space-between"}>
              <Dialog.ActionTrigger asChild>
                <Button w={convertPx(150)} variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                w={convertPx(150)}
                bg={"themeColor"}
                onClick={onSave}
                disabled={disableSaveButton}
              >
                Save
              </Button>
            </Dialog.Footer>

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
