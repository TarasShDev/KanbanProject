using System;
using System.Data;
using System.Data.SQLite;
using System.IO;
using Dapper;
using Dapper.Contrib.Extensions;

namespace PlanningBoard.Model
{
    public class BaseRepository
    {
        static string dbName = AppDomain.CurrentDomain.BaseDirectory + "App_Data\\planningboard.sqlite";

        public static SQLiteConnection GetConnection()
        {
            return new SQLiteConnection("Data Source=" + dbName);
        }

        public static void GenerateDB()
        {
            if (DbExist)
                return;

            SQLiteConnection.CreateFile(dbName);
            using (var cnn = new SQLiteConnection("Data Source=" + dbName))
            {
                cnn.Open();
                CreateTables(cnn);

                //seed test data
                InsertColors(cnn);
                InsertSampleTasks(cnn);
                var boardId = (int)InsertBoard(cnn);
                InsertUsers(cnn, boardId);
                InsertColumns(cnn, boardId);
            }
        }

        private static bool DbExist => File.Exists(dbName);

        private static void CreateTables(IDbConnection cnn)
        {
            cnn.Execute(@"create table Boards (
                    Id integer primary key AUTOINCREMENT,
                    Name varchar(100) not null)");

            cnn.Execute(@"create table Users (
                    Id integer primary key AUTOINCREMENT,
                    Username varchar(255) not null)");

            cnn.Execute(@"create table BoardUsers (
                    UserId integer not null,
                    BoardId integer not null,
                    IsAdmin bool not null)");

            cnn.Execute(@"create table Colors (
                    Id integer primary key AUTOINCREMENT,
                    Name varchar(100) not null,
                    ColorCode varchar(100) not null)");

            cnn.Execute(@"create table Columns (
                    Id integer primary key AUTOINCREMENT,
                    BoardId integer not null,
                    Name varchar(100) not null)");

            cnn.Execute(@"create table Tasks (
                    Id integer primary key AUTOINCREMENT,
                    ColumnId integer not null,
                    Title varchar(100) not null,
                    Description varchar(1000) not null,
                    Prio integer not null,
                    ColorId integer not null,
                    Owner varchar(100) )");
        }

        private static long InsertBoard(IDbConnection cnn)
        {
            return cnn.Insert(new Board(){ Name = "Sample board" });
        }

        private static void InsertUsers(IDbConnection cnn, int boardId)
        {
            var userId = cnn.Insert(new User() { Username = "Johan" });
            cnn.Insert(new BoardUser() { UserId = (int)userId, BoardId = boardId, IsAdmin = true });
        }

        private static void InsertColumns(IDbConnection cnn, int boardId)
        {
            cnn.Insert(new Column() { Name = "ToDo", BoardId = boardId });
            cnn.Insert(new Column() { Name = "Doing", BoardId = boardId });
            cnn.Insert(new Column() { Name = "Test", BoardId = boardId });
            cnn.Insert(new Column() { Name = "Done", BoardId = boardId });
        }

        private static void InsertSampleTasks(IDbConnection cnn)
        {
            cnn.Insert(new Task()
            {
                Title = "Sample task",
                Description = "Sample description",
            });
        }

        private static void InsertColors(IDbConnection cnn)
        {
            cnn.Insert(new Color() { Name = "Red", ColorCode = "#ffbdbd" });
            cnn.Insert(new Color() { Name = "Yellow", ColorCode = "#fff4bd" });
            cnn.Insert(new Color() { Name = "Green", ColorCode = "#bdffc4" });
            cnn.Insert(new Color() { Name = "Blue", ColorCode = "#bdffff" });
            cnn.Insert(new Color() { Name = "Pink", ColorCode = "#ffbdf6" });
        }
    }
}