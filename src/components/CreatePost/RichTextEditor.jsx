import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

const RichTextEditor = ({editorRef, onChangeBodyText}) => {
  const {colors} = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={{minHeight: 285}}>
      <RichToolbar
        actions={[
          actions.setStrikethrough,
          actions.removeFormat,
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.setUnderline,
          actions.alignRight,
          actions.code,
          actions.line,
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading1]: ({tintColor}) => (
            <Text style={{color: tintColor}}>H1</Text>
          ),
          [actions.heading4]: ({tintColor}) => (
            <Text style={{color: tintColor}}>H4</Text>
          ),
        }}
        editor={editorRef}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedIconTint={colors.primary}
        disable={false}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.richEditorContiainer}
        editorStyle={styles.richEditorStyle}
        placeholder={"What's on your mind?"}
        onChange={onChangeBodyText}
      />
    </View>
  );
};

export default RichTextEditor;

const createStyles = colors =>
  StyleSheet.create({
    richBar: {
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      backgroundColor: colors.darkLight,
    },
    flatStyle: {
      paddingHorizontal: 8,
      gap: 3,
    },
    richEditorContiainer: {
      backgroundColor: '#fff',
      minHeight: 240,
      flex: 1,
      borderWidth: 1.5,
      borderTopWidth: 0,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      borderCurve: 'continuous',
      borderColor: colors.darkLight,
      padding: 5,
    },
    richEditorStyle: {
      color: colors.dark,
      placeholderColor: colors.placeHolderTextcolor,
    },
  });
