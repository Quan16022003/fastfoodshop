import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';

const getStatusColor = (status) => {
  switch (status) {
    case 'Trống':
      return 'success.main';
    case 'Đang sử dụng':
      return 'primary.main';
    case 'Đã đặt':
      return 'warning.main';
    case 'Đang dọn dẹp':
      return 'info.main';
    case 'Bảo trì':
      return 'error.main';
    default:
      return 'text.primary';
  }
};

function TableStatusHistory({ open, onClose, history }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lịch sử trạng thái bàn</DialogTitle>
      <DialogContent>
        <List>
          {history.map((record, index) => (
            <div key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography sx={{ color: getStatusColor(record.status) }}>
                      {record.status}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Thời gian: {new Date(record.timestamp).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Người thực hiện: {record.user}
                      </Typography>
                      {record.note && (
                        <Typography variant="body2" color="text.secondary">
                          Ghi chú: {record.note}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              {index < history.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default TableStatusHistory; 