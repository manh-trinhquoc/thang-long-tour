// Thêm data vào lịch sử nếu ko phải là reload trang
console.log('Thêm lịch sử xem tour');
let tourID = window.location.href.split("=")[1];
let lastID = currentUserObj.historyViewed[0]
if (tourID != lastID) {
    // nếu trước đó đã có id này thì xóa id ở vị trí cũ
    let index = currentUserObj.historyViewed.findIndex(function(currentValue) {
        return currentValue == tourID;
    });
    if (index >= 0) currentUserObj.historyViewed.splice(index, 1);
    // thêm id mới
    currentUserObj.historyViewed.unshift(tourID);
    for (; currentUserObj.historyViewed.length > 8;) {
        currentUserObj.historyViewed.pop();
    }
    localStorage.setItem('historyViewed', JSON.stringify(currentUserObj.historyViewed));
    console.group('add tourID to historyViewed');
    console.log(JSON.stringify(currentUserObj.historyViewed));
    console.groupEnd();
}