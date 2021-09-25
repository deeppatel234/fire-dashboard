import React, { useEffect } from "react";

import { FieldArray } from "formik";

import Input from "components/Input";
import Button from "components/Button";
import FormItem from "components/FormItem";

const MultiImage = ({ formKey, value, setValue }) => {
  useEffect(() => {
    if (!value?.length) {
      setValue(`${formKey}[0]`, "");
    }
  }, [value]);

  return (
    <FieldArray
      name={formKey}
      render={({ push, remove }) => {
        return (
          <FormItem label="Custom Image Urls">
            <div className="mutli-image-wrapper">
              {value?.length
                ? value.map((val, index) => {
                    return (
                      <div key={index} className="input-wrapper">
                        <Input
                          value={val}
                          onChangeValue={(newVal) =>
                            setValue(`${formKey}[${index}]`, newVal)
                          }
                        />
                        {value?.length > 1 ? (
                          <span
                            className="close-icon"
                            onClick={() => remove(index)}
                          >
                            <i className="ri-close-line" />
                          </span>
                        ) : null}
                      </div>
                    );
                  })
                : null}
              <div className="footer-add">
                <Button
                  link
                  className="p0"
                  iconLeft="ri-add-line"
                  onClick={() => push("")}
                >
                  Add
                </Button>
              </div>
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default MultiImage;
