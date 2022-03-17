$(function() {
    // チェックボックスの作成
    $(document).on('change', '#body_setting', changeValue);
    $(document).on('change', '.all', changeAll);
});