import { useEffect, useId, useState } from "react";
import { uploadImage } from "../services/uploadService";
import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    ListBox,
    Modal,
    Select,
    TextArea,
    TextField,
} from "@heroui/react";

import {
    createMission,
    updateMission,
} from "../services/MissionService";

import {
    createSubmarine,
    getAllSubmarines,
    updateSubmarine,
} from "../services/submarineService";

import { getAllLocations } from "../services/locationServices";

const missionFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "objective", label: "Objective", type: "textarea" },
    { name: "startDate", label: "Start date", type: "date" },
    {
        name: "endDate",
        label: "End date",
        type: "date",
        optional: true,
    },
];

const submarineFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "model", label: "Model", type: "text" },
    {
        name: "maxDepth",
        label: "Maximum depth (meters)",
        type: "number",
        min: 0.01,
        step: "any",
    },
    {
        name: "capacity",
        label: "Capacity",
        type: "number",
        min: 1,
        step: 1,
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        optional: true,
    },
];

function getId(value) {
    return value?._id ?? value ?? "";
}

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Please try again."
    );
}

export default function RecordFormModal({
    kind,
    user,
    record = null,
    onClose,
    onSaved,
}) {
    const formId = useId();
    const isMission = kind === "mission";
    const isEditing = Boolean(record?._id);
    const resourceName = isMission ? "Mission" : "Submarine";
    const fields = isMission ? missionFields : submarineFields;

    const canSubmit = isEditing
        ? ["admin", "researcher"].includes(user?.role)
        : ["admin", "visitor"].includes(user?.role);

    const [values, setValues] = useState(() => {
        const initialValues = {};

        for (const field of fields) {
            const value = record?.[field.name];

            initialValues[field.name] =
                field.type === "date"
                    ? value?.slice(0, 10) ?? ""
                    : String(value ?? "");
        }

        if (isMission) {
            initialValues.submarine = getId(record?.submarine);
            initialValues.location = getId(record?.location);
        } else {
            initialValues.image = record?.image ?? "";
        }

        return initialValues;
    });

    const [options, setOptions] = useState({
        submarine: [],
        location: [],
    });

    const [loading, setLoading] = useState(isMission);
    const [optionsError, setOptionsError] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (!isMission || !canSubmit) return;

        let active = true;

        async function loadOptions() {
            try {
                const [submarineData, locations] = await Promise.all([
                    getAllSubmarines(),
                    getAllLocations(),
                ]);

                if (active) {
                    setOptions({
                        submarine: submarineData.submarines,
                        location: locations,
                    });
                }
            } catch (err) {
                if (active) setOptionsError(getErrorMessage(err));
            } finally {
                if (active) setLoading(false);
            }
        }

        loadOptions();

        return () => {
            active = false;
        };
    }, [isMission, canSubmit]);

    function changeValue(name, value) {
        setValues((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!canSubmit || saving || loading || optionsError) return;

        setSaving(true);
        setError("");

        try {
            let saved;

            if (isMission) {
                const payload = {
                    ...values,
                    title: values.title.trim(),
                    objective: values.objective.trim(),
                    endDate: values.endDate || null,
                };

                // Preserve existing researchers and equipment when editing.
                if (isEditing) {
                    payload.missionResearchers = (
                        record.missionResearchers ?? []
                    ).map(getId);

                    payload.equipment = (record.equipment ?? []).map(getId);
                }

                saved = isEditing
                    ? await updateMission(record._id, payload)
                    : await createMission(payload);

                // PUT returns IDs; keep the detail page's display objects.
                saved = {
                    ...saved,
                    submarine:
                        options.submarine.find(
                            (item) => item._id === values.submarine
                        ) ?? saved.submarine,
                    location:
                        options.location.find(
                            (item) => item._id === values.location
                        ) ?? saved.location,
                    missionResearchers: isEditing
                        ? record.missionResearchers
                        : saved.missionResearchers,
                    equipment: isEditing
                        ? record.equipment
                        : saved.equipment,
                };
            } else {
                const payload = {
                    ...values,
                    name: values.name.trim(),
                    model: values.model.trim(),
                    maxDepth: Number(values.maxDepth),
                    capacity: Number(values.capacity),
                    image: values.image,
                };

                if (imageFile) {
                    const uploaded = await uploadImage(imageFile);

                    payload.image = uploaded.image;

                    // Reuse the uploaded image if saving the record needs a retry.
                    changeValue("image", uploaded.image);
                    setImageFile(null);
                }

                const result = isEditing
                    ? await updateSubmarine(record._id, payload)
                    : await createSubmarine(payload);

                saved = result.submarine;
            }

            onSaved(saved);
            onClose();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    if (!canSubmit) return null;

    const disabled = saving || loading || Boolean(optionsError);
    return (
        <Modal.Backdrop
            isOpen
            isDismissable={!saving}
            isKeyboardDismissDisabled={saving}
            onOpenChange={(open) => {
                if (!open && !saving) onClose();
            }}
        >
            <Modal.Container size="lg" scroll="inside">
                <Modal.Dialog>
                    <Modal.CloseTrigger isDisabled={saving} />

                    <Modal.Header>
                        <Modal.Heading>
                            {isEditing ? "Edit" : "Create"} {resourceName}
                        </Modal.Heading>
                    </Modal.Header>

                    <Modal.Body>
                        {loading && <p role="status">Loading form options...</p>}

                        {optionsError && (
                            <p role="alert" className="text-danger">
                                {optionsError}
                            </p>
                        )}

                        <Form
                            id={formId}
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            {fields.map((field) => {
                                const required = !field.optional;
                                const id = `${formId}-${field.name}`;

                                // Native date/number validation with HeroUI inputs.
                                if (
                                    field.type === "date" ||
                                    field.type === "number"
                                ) {
                                    return (
                                        <div
                                            key={field.name}
                                            className="flex flex-col gap-1"
                                        >
                                            <label htmlFor={id}>
                                                {field.label}
                                                {required ? " *" : ""}
                                            </label>

                                            <Input
                                                id={id}
                                                name={field.name}
                                                type={field.type}
                                                value={values[field.name]}
                                                required={required}
                                                disabled={disabled}
                                                min={
                                                    field.name === "endDate"
                                                        ? values.startDate || undefined
                                                        : field.min
                                                }
                                                step={field.step}
                                                onChange={(event) =>
                                                    changeValue(
                                                        field.name,
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    );
                                }

                                return (
                                    <TextField
                                        key={field.name}
                                        name={field.name}
                                        value={values[field.name]}
                                        onChange={(value) =>
                                            changeValue(field.name, value)
                                        }
                                        isRequired={required}
                                        isDisabled={disabled}
                                        validate={(value) =>
                                            required && !value.trim()
                                                ? `${field.label} is required.`
                                                : null
                                        }
                                    >
                                        <Label>{field.label}</Label>

                                        {field.type === "textarea" ? (
                                            <TextArea rows={3} />
                                        ) : (
                                            <Input type={field.type} />
                                        )}

                                        <FieldError />
                                    </TextField>
                                );
                            })}

                            {!isMission && (
                                <div className="flex flex-col gap-2">
                                    <label htmlFor={`${formId}-image`}>
                                        Submarine image
                                    </label>

                                    <input
                                        id={`${formId}-image`}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        aria-describedby={`${formId}-image-help`}
                                        disabled={disabled}
                                        onChange={(event) =>
                                            setImageFile(event.target.files?.[0] ?? null)
                                        }
                                    />

                                    <p id={`${formId}-image-help`} className="text-sm text-muted">
                                        JPEG, PNG, or WebP. Maximum size: 5 MB.
                                    </p>

                                    {values.image && (
                                        <img
                                            src={values.image}
                                            alt="Current submarine"
                                            className="h-32 w-48 rounded-lg object-cover"
                                        />
                                    )}
                                </div>
                            )}

                            {isMission &&
                                ["submarine", "location"].map((name) => (
                                    <Select
                                        key={name}
                                        name={name}
                                        isRequired
                                        isDisabled={disabled}
                                        placeholder={`Select a ${name}`}
                                        value={values[name] || null}
                                        onChange={(value) =>
                                            changeValue(name, value ?? "")
                                        }
                                    >
                                        <Label>
                                            {name === "submarine"
                                                ? "Submarine"
                                                : "Location"}
                                        </Label>

                                        <Select.Trigger>
                                            <Select.Value />
                                            <Select.Indicator />
                                        </Select.Trigger>

                                        <Select.Popover>
                                            <ListBox>
                                                {options[name].map((item) => (
                                                    <ListBox.Item
                                                        key={item._id}
                                                        id={item._id}
                                                        textValue={item.name}
                                                    >
                                                        {item.name}
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                ))}
                                            </ListBox>
                                        </Select.Popover>

                                        <FieldError />
                                    </Select>
                                ))}

                            {error && (
                                <p role="alert" className="text-danger">
                                    {error}
                                </p>
                            )}
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            type="button"
                            variant="secondary"
                            isDisabled={saving}
                            onPress={onClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            form={formId}
                            isDisabled={disabled}
                            isPending={saving}
                        >
                            {saving
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : `Create ${resourceName}`}
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    );
}
