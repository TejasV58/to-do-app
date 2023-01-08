import { Tag, Input, Space } from "antd";
import { useRef, useState } from "react";

const TagList = ({ value, onChange }) => {
  const ref = useRef(null);
  const [tags, setTags] = useState(value);
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClose = (removedTag) => {
    const updatedTagsList = tags.filter((tag) => tag.key !== removedTag.key);
    onChange(updatedTagsList);
    setTags(updatedTagsList);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...(tags || [])];
    if (
      inputValue &&
      tempsTags.filter((tag) => tag.label === inputValue).length === 0
    ) {
      const key = 'tag-'+new Date().getTime().toString();
      tempsTags = [
        ...tempsTags,
        { key, label: inputValue },
      ];
    }
    onChange(tempsTags);
    setTags(tempsTags);
    setInputValue("");
  };

  return (
    <Space>
      {(tags || []).map((item) => (
        <Tag
          key={item.key}
          closable={item.key !== 0}
          onClose={() => handleClose(item)}
        >
          {item.label}
        </Tag>
      ))}
      <Input
        ref={ref}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </Space>
  );
};

export default TagList;
