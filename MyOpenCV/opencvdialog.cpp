#include "opencvdialog.h"
#include "ui_opencvdialog.h"

#include <QFileDialog>
#include <QMessageBox>
#include <QDebug>
#include <opencv2/objdetect/objdetect.hpp>
#include "opencv2/imgproc/imgproc.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/opencv.hpp"
#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/types_c.h>

using namespace cv;
Mat gray;
Mat binaryImg;
QImage pic;


OpenCVDialog::OpenCVDialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::OpenCVDialog)
{
    ui->setupUi(this);
}

OpenCVDialog::~OpenCVDialog()
{
    delete ui;
}

void OpenCVDialog::on_openButton_clicked()
{

    ui->filenameLabel->clear();//清除原来的内容
    ui->imageLabel->clear();
    ui->grayLabel->clear();
    ui->binaryLabel->clear();
    gray.release();
    binaryImg.release();
    try {
        fileName=QFileDialog::getOpenFileName(this,"Open Image File","./","Image File(*.jpg)");//文件打开对话框
    } catch (const std::exception &e) {
        QMessageBox::critical(this, "错误", QStringLiteral("文件打开失败") + e.what());
    }
    QMessageBox::warning(this,"",QStringLiteral("要打开的文件是：")+fileName,QMessageBox::Yes);//显示文件名信息
    ui->filenameLabel->setText(fileName);//打开后设置文件名
    if(fileName.isEmpty()){
        QMessageBox qmb;
        qmb.warning(this,"打开图像","打开图像失败"+fileName,QMessageBox::Yes);
    }else{
        QImage img(fileName);               //实例化一个QImage对象
       pic=img;
        qDebug() << "【openbutton】自适应前Image size:" << img.size();
        img=img.scaled(ui->imageLabel->width(),ui->imageLabel->height(),Qt::KeepAspectRatio); //QT：keepAspectRatio自适应大小
        qDebug() << "【openbutton】自适应后Image size:" << img.size();
        ui->imageLabel->setPixmap(QPixmap::fromImage(img));        //显示到界面指定的那个label页面框中
        if(img.isNull()){
            QMessageBox::information(this,"信息",QStringLiteral("打开文件失败"));
        }else{
            globalMark=1;//存储标记，用于判断是否有文件
            globalImg=img;
        }
    }

    try {
    } catch (const std::exception &e) {
        // 捕捉标准异常并显示错误信息
        QMessageBox::critical(this, "错误", QStringLiteral("发生异常：") + e.what());
    }
}

void OpenCVDialog::on_grayButton_clicked()
{

    //灰度化图像
    gray=imread(fileName.toLatin1().data());
    if (gray.empty()) {
        QMessageBox::warning(this,"警告",QStringLiteral("无目标图片"),QMessageBox::Yes);
        return;
    }
    cv::cvtColor(gray,gray,CV_RGB2GRAY);
    QImage img=QImage((const unsigned char*)(gray.data),gray.cols,gray.rows,QImage::Format_Indexed8);
    img=img.scaled(ui->imageLabel->width(),ui->imageLabel->height(),Qt::KeepAspectRatio); //QT：keepAspectRatio自适应大小
    ui->imageLabel->setPixmap(QPixmap::fromImage(img));
    qDebug() << "【graybutton】Image size:" << img.size();
    qDebug() << "【graybutton】Label size:" << ui->imageLabel->size();
    try {
        imwrite("C:\\pic\\gray.jpg",gray);
    } catch (const std::exception &e) {
        // 捕捉标准异常并显示错误信息
        QMessageBox::critical(this, "错误", QStringLiteral("文件保存发生异常：") + e.what());
    }
    QMessageBox::information(this,"保存图像",QStringLiteral("图像已经保存！"),QMessageBox::Yes);

}
void OpenCVDialog::on_Vampix_clicked()//黑白化
{
    gray =imread(fileName.toLatin1().data()); // 读取图像
    if (gray.empty()) {
        QMessageBox::warning(this,"警告",QStringLiteral("无目标图片"),QMessageBox::Yes);
        return;
    }
    cv::cvtColor(gray, gray, CV_BGR2GRAY);// 将图像转换为灰度图像
    // 设置阈值
    double thresholdValue = 128;  // 阈值可以根据需要调整
    double maxValue = 255;  // 二值化后白色的值
    cv::threshold(gray, binaryImg, thresholdValue, maxValue, cv::THRESH_BINARY);// 应用二值化
    // 将二值化后的图像转换为 QImage 对象
    QImage img = QImage((const unsigned char*)(binaryImg.data), binaryImg.cols, binaryImg.rows, QImage::Format_Indexed8);
    // 显示二值化后的图像
    //img=img.scaled(ui->imageLabel->width(),ui->imageLabel->height(),Qt::KeepAspectRatio); //QT：keepAspectRatio自适应大小
    ui->imageLabel->setPixmap(QPixmap::fromImage(img));
    try {
        imwrite("C:\\pic\\binary.jpg",binaryImg);
    } catch (const std::exception &e) {
        // 捕捉标准异常并显示错误信息
        QMessageBox::critical(this, "错误", QStringLiteral("文件保存发生异常：") + e.what());
    }
    QMessageBox::information(this,"保存图像",QStringLiteral("图像已经保存！"),QMessageBox::Yes);
}

void OpenCVDialog::on_showButton_clicked()
{
    QImage binaryimg = QImage((const unsigned char*)(binaryImg.data), binaryImg.cols, binaryImg.rows, QImage::Format_Indexed8);
    QImage grayimg = QImage((const unsigned char*)(gray.data), gray.cols, gray.rows, QImage::Format_Indexed8);
    // 显示二值化后的图像
    //binaryimg=binaryimg.scaled(ui->grayLabel->width(),ui->grayLabel->height(),Qt::KeepAspectRatio); //QT：keepAspectRatio自适应大小

    ui->grayLabel->setPixmap(QPixmap::fromImage(grayimg));
    ui->binaryLabel->setPixmap(QPixmap::fromImage(binaryimg));
    pic=pic.scaled(ui->imageLabel->width(),ui->imageLabel->height(),Qt::KeepAspectRatio);
    ui->imageLabel->setPixmap(QPixmap::fromImage(pic));
}



