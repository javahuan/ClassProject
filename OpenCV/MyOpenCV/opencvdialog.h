#ifndef OPENCVDIALOG_H
#define OPENCVDIALOG_H

#include <QDialog>

namespace Ui {
class OpenCVDialog;
}

class OpenCVDialog : public QDialog
{
    Q_OBJECT

public:
    explicit OpenCVDialog(QWidget *parent = nullptr);
    ~OpenCVDialog();

private slots:
    void on_openButton_clicked();

    void on_grayButton_clicked();

    void on_showButton_clicked();

    void on_Vampix_clicked();

private:
    Ui::OpenCVDialog *ui;
    QString fileName;
    int globalMark;
    QImage globalImg;
};

#endif // OPENCVDIALOG_H
