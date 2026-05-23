export const PHONE_RE = /^[0-9+\-\s]{8,20}$/;

export const STATUS_OPTIONS = ["pending", "active", "completed", "cancelled"];

export const EMPTY_SHIPPING = {
  recipient_name: "",
  phone: "",
  shipping_address: "",
  note: "",
};

/**
 * Validate the shipping fields.
 * @returns {Record<string, string>} field name -> error message (empty when valid)
 */
export function getShippingErrors(values) {
  const errors = {};
  if (!values.recipient_name?.trim()) {
    errors.recipient_name = "Recipient name is required";
  }
  if (!values.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!PHONE_RE.test(values.phone.trim())) {
    errors.phone = "Phone must be 8-20 digits (may include +, -, spaces)";
  }
  if (!values.shipping_address?.trim()) {
    errors.shipping_address = "Shipping address is required";
  }
  return errors;
}

/** First error message, or null when the shipping fields are valid. */
export function firstShippingError(values) {
  const errors = getShippingErrors(values);
  const keys = Object.keys(errors);
  return keys.length ? errors[keys[0]] : null;
}

/** Trimmed payload ready to send to the API (note becomes null when empty). */
export function toShippingPayload(values) {
  return {
    recipient_name: values.recipient_name.trim(),
    phone: values.phone.trim(),
    shipping_address: values.shipping_address.trim(),
    note: values.note?.trim() || null,
  };
}
