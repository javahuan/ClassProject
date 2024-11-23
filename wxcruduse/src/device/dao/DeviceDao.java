package device.dao;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

import org.json.JSONException;
import org.json.JSONObject;
import com.sun.deploy.util.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import device.dao.Db;

public class DeviceDao {
	public void showDebug(String msg) {
		System.out.println("[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][device/dao/DeviceDao]" + msg);
	}

	/*添加记录*/
	public void addDeviceRecord(Data data, JSONObject json) throws JSONException, SQLException {
		//构造sql语句，根据传递过来的条件参数
		String deviceType = data.getParam().has("type") ? data.getParam().getString("type") : null;
		String deviceName = data.getParam().has("title") ? data.getParam().getString("title") : null;
		String ctime = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date());
		if (deviceType != null && deviceName != null) {
			String sql = "insert into device_file(device_name,device_type,create_time)";
			sql = sql + " values('" + deviceName + "'";
			sql = sql + " , '" + deviceType + "' , '" + ctime + "')  ";
			data.getParam().put("sql", sql);
			updateRecord(data, json);
		}
	}
	/*添加记录(包含图片)*/
	public void addDevicePicRecord(Data data, JSONObject json) throws JSONException, SQLException {
		//构造sql语句，根据传递过来的条件参数
		String deviceType = data.getParam().has("type") ? data.getParam().getString("type") : null;
		String deviceName = data.getParam().has("title") ? data.getParam().getString("title") : null;
		String ctime = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date());
		//limitTime虽然没有存到数据表里，控制台输出看一下
		String limitTime=data.getParam().has("limit_time")?data.getParam().getString("limit_time"):null;
		showDebug("[addDevicePicRecord]limitTime="+limitTime);

		String deviceId="device_"+(new SimpleDateFormat("yyyyMMddHHmmss")).format(new Date());				//传到前端的本次上传的唯一流水号
		String creatorId="00000000";					//这个可以换成当前操作者的系统唯一用户编号
		String creator="系统管理员";					//这个可以换成当前操作者的用户中文姓名
		String createTime=(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date());
		if(deviceName!=null&&deviceType!=null){
			String sql="insert into device_file(device_name,device_type,create_time,device_id,creator)";
			sql = sql + " values('" + deviceName + "'";
			sql = sql + " , '" + deviceType + "' , '" + ctime + "','"+deviceId+"','"+creator+"')  ";
			data.getParam().put("sql", sql);
			updateRecord(data, json);

			//如果有附件，就更新附件
			String str=data.getParam().getString("attachment_ids");
			showDebug("[addDevicePicRecord]整理之前的str="+str);
			str=str.substring(1,str.length()-1);		//去掉前后的[]，传输过来的例如：["ATTACH_20211112111539","ATTACH_20211112111543"]
			showDebug("[addDevicePicRecord]str="+str);
			List<String> list = Arrays.asList(str.split(","));

			for (int i = 0; i < list.size(); i++) {
				String attachmentId = list.get(i);

				attachmentId=attachmentId.replaceAll("\"","");	//把里头的双引号去掉
				showDebug("[------------------addDevicePicRecord]" + attachmentId);
				sql = "update public_attachment set parent_id='" + deviceId + "' where object_id='" + attachmentId + "'";
				data.getParam().put("sql",sql);
				showDebug("[------------------addDevicePicRecord]" + sql);
				updateRecord(data,json);
			}
		}
	}

	/*删除记录*/
	public void deleteDeviceRecord(Data data, JSONObject json) throws JSONException, SQLException {
		//构造sql语句，根据传递过来的条件参数
		String id = data.getParam().has("id") ? data.getParam().getString("id") : null;
		if (id != null) {
			String sql = "delete from device_file where id = " + data.getParam().getString("id");
			data.getParam().put("sql", sql);
			updateRecord(data, json);
		}
	}

	/*修改记录*/
	public void modifyDeviceRecord(Data data, JSONObject json) throws JSONException, SQLException {
		//构造sql语句，根据传递过来的条件参数
		String id = data.getParam().has("id") ? data.getParam().getString("id") : null;
		String deviceName = data.getParam().has("title") ? data.getParam().getString("title") : null;
		String deviceType = data.getParam().has("type") ? data.getParam().getString("type") : null;
		System.out.println("[DeviceDao：]" + deviceName);
		if (id != null) {
			String sql = "update device_file";
			sql = sql + " set device_name='" + deviceName + "'";
			sql = sql + " ,device_type='" + deviceType + "'";
			sql = sql + " where id=" + id;
			data.getParam().put("sql", sql);
			updateRecord(data, json);
		}
	}

	/*查询记录*/
	public void getDeviceRecord(Data data, JSONObject json) throws JSONException, SQLException {
		//构造sql语句，根据传递过来的查询条件参数
		String sql = createGetRecordSql(data);            //构造sql语句，根据传递过来的查询条件参数
		data.getParam().put("sql", sql);
		queryRecord(data, json);
	}

	/*
	 * 这是一个样板的函数，可以拷贝做修改用
	 */
	public void updateRecord(Data data, JSONObject json) throws JSONException, SQLException {
		/*--------------------获取变量 开始--------------------*/
		JSONObject param = data.getParam();
		int resultCode = 0;
		String resultMsg = "ok";
		/*--------------------获取变量 完毕--------------------*/
		/*--------------------数据操作 开始--------------------*/
		Db updateDb = new Db("test");
		String sql = data.getParam().getString("sql");
		showDebug("[updateRecord]" + sql);
		updateDb.executeUpdate(sql);
		updateDb.close();
		/*--------------------数据操作 结束--------------------*/
		/*--------------------返回数据 开始--------------------*/
		json.put("result_msg", resultMsg);                                                            //如果发生错误就设置成"error"等
		json.put("result_code", resultCode);                                                        //返回0表示正常，不等于0就表示有错误产生，错误代码
		/*--------------------返回数据 结束--------------------*/
	}

	public void queryRecord(Data data, JSONObject json) throws JSONException, SQLException {
		/*--------------------获取变量 开始--------------------*/
		String action = data.getParam().getString("action");
		String resultMsg = "ok";
		int resultCode = 0;
		List jsonList = new ArrayList();
		List jsonName = new ArrayList();
		/*--------------------获取变量 完毕--------------------*/
		/*--------------------数据操作 开始--------------------*/
		Db queryDb = new Db("test");
		String sql = data.getParam().getString("sql");
		showDebug("[queryRecord]构造的SQL语句是：" + sql);
		try {
			ResultSet rs = queryDb.executeQuery(sql);
			ResultSetMetaData rsmd = rs.getMetaData();
			int fieldCount = rsmd.getColumnCount();
			while (rs.next()) {
				Map map = new HashMap();
				for (int i = 0; i < fieldCount; i++) {
					map.put(rsmd.getColumnName(i + 1), rs.getString(rsmd.getColumnName(i + 1)));
				}
				jsonList.add(map);
			}
			rs.close();
		} catch (Exception e) {
			e.printStackTrace();
			showDebug("[queryRecord]查询数据库出现错误：" + sql);
			resultCode = 10;
			resultMsg = "查询数据库出现错误！" + e.getMessage();
		}
		queryDb.close();
		/*--------------------数据操作 结束--------------------*/
		/*--------------------返回数据 开始--------------------*/
		json.put("aaData", jsonList);
		json.put("aaFieldName", jsonName);
		json.put("result_msg", resultMsg);                                                            //如果发生错误就设置成"error"等
		json.put("result_code", resultCode);                                                        //返回0表示正常，不等于0就表示有错误产生，错误代码
		/*--------------------返回数据 结束--------------------*/
	}

	public String createGetRecordSql(Data data) throws JSONException {
		String sql = "select * from device_file";
		String id = data.getParam().has("id") ? data.getParam().getString("id") : null;
		String wantAttachment=data.getParam().has("want_attachment")?data.getParam().getString("want_attachment"):null;
		if (id != null && !id.isEmpty())
			sql = sql + " where id=" + id;
		if(wantAttachment!=null){
			//然后加上附件public_attachment，用子查询来实现从查询结果里关联，并获取对应的一条记录
			sql="select b.attachment_url,a.* from ("+sql+") a left join (select max(create_time),id,parent_id,attachment_url from public_attachment group by attachment_url) b on a.device_id=b.parent_id";
			//sql="select b.attachment_url,a.* from ("+sql+") a  join (select attachment_url from public_attachment ) b ";
		}

		return sql;

	}

	public void saveUploadRecord(Data data, JSONObject json) throws JSONException, SQLException {
		if (json.getJSONArray("files").length() > 0) {
			JSONArray array = (JSONArray) json.getJSONArray("files");
			for (int i = 0; i < array.length(); i++) {
				HashMap map = (HashMap) array.get(0);
				String downloadUrl = (String) map.get("download_url");
				String newFileName = (String) map.get("file_name");
				String filePath = (String) map.get("file_path");
				filePath = filePath.replaceAll("\\\\", "\\\\\\\\");
				String creatorId = "00000000";                    //这个可以换成当前操作者的系统唯一用户编号
				String creator = "系统管理员";                    //这个可以换成当前操作者的用户中文姓名
				String objectId = "ATTACH_" + (new SimpleDateFormat("yyyyMMddHHmmss")).format(new Date());                //传到前端的本次上传的唯一流水号
				String createTime = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date());
				String sql = "insert into public_attachment(object_id,attachment_name,attachment_filename,attachment_url,creator_id,creator,create_time)";
				sql = sql + " values('" + objectId + "','" + newFileName + "','" + filePath + "','" + downloadUrl + "','" + creatorId + "','" + creator + "','" + createTime + "')";
				showDebug("[saveUploadRecord]：sql=" + sql);
				data.getParam().put("sql", sql);
				updateRecord(data, json);
				showDebug("[saveUploadRecord]：attachment_id=" + objectId);
				json.put("attachment_id", objectId);
			}
		}
	}

}

