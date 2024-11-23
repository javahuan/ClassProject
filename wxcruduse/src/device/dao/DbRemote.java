package device.dao;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DbRemote {
	int debugLevel=0;
	private Connection connection;
	private Statement statement;
	public void showDebug(String msg){
		System.out.println("["+(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date())+"][device/dao/Db]"+msg);
	}
	public DbRemote(String dbName) {
		//开始连接数据库，如果是发布了的Tomcat环境，需要先把mysql-connector-java-5.0.4-bin.jar和json.jar拷贝到ROOT/WEB-INF/lib下
		//如果是IDEA开发环境，则把这两个jar拷贝到项目lib下，注意要进行“Add as library的操作”，让系统添加关联的依赖
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException classnotfoundexception) {
			classnotfoundexception.printStackTrace();
		}
		showDebug("加载了JDBC驱动");

		// 然后链接数据库，开始操作数据表
		try {
			//这里要注意改成自己的数据库的名称、账号、密码
			showDebug("准备连接数据库");
//			String connStr="jdbc:mysql://www.OMG.net:3306/"+dbName+"?user=javaaaa&password=12345666&useUnicode=true&characterEncoding=UTF-8";
			//String connStr="jdbc:mysql://localhost:3306/"+dbName+"?user=root&password=123456&useUnicode=true&characterEncoding=UTF-8";
			String connStr="jdbc:mysql://www.ylxteach.net:3366/"+dbName+"?user=Administrator&password=XWClassroom20202023&useUnicode=true&characterEncoding=UTF-8";
			showDebug("准备getConnection，connection是："+connStr);
			connection = DriverManager.getConnection(connStr);
			showDebug("准备statement，connection是："+connStr);
			statement = connection.createStatement();
			showDebug("已经链接上数据库！");
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
		}
	}
	public ResultSet executeQuery(String sql){
		ResultSet resultset = null;
		try {
			if(debugLevel>0){
				showDebug("["+(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date())+"]"+"Db executeQuery:" + sql);
			}
			resultset = statement.executeQuery(sql);
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
		}
		return resultset;
	}
	public void executeUpdate(String sql){
		try {
			if(debugLevel>0){
				showDebug("["+(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date())+"]"+"Db executeUpdate:" + sql);
			}
			statement.executeUpdate(sql);
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
		}
	}
	public void close() {
		try {
			statement.close();
			connection.close();
			showDebug("操作数据完毕，关闭了数据库！");
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
		}
	}
}
