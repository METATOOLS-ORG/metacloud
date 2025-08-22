export function getFormData(event: SubmitEvent) {
    event.preventDefault();
    return new FormData(event.currentTarget as HTMLFormElement);
}
