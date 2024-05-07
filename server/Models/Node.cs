using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using server.DAL;

namespace server.Models;

public class NodeDto
{
    public required string Id { get; set; }
    public required Position Position { get; set; }
    public NodeType Type { get; set; }
    public required NodeData Data { get; set; }
}

public abstract class Node(string id, Position position, NodeType type)
{
    [Key]
    public string Id { get; set; } = id;
    public Position Position { get; set; } = position;
    public NodeType Type { get; set; } = type;
}

public class Position
{
    public double X { get; set; }
    public double Y { get; set; }
}

public class Relation
{
    public required string Id { get; set; }
}

public class NodeData
{
    public string CustomName { get; set; } = string.Empty;
    public List<CustomAttribute> CustomAttributes { get; set; } = [];
    public AspectType Aspect
    { get; set; } = AspectType.Empty;
    public string Label { get; set; } = string.Empty;
    public long CreatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    public long UpdatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    public string CreatedBy { get; set; } = string.Empty;

}

[JsonConverter(typeof(AspectTypeConverter))]
public enum AspectType
{
    Function,
    Product,
    Location,
    Empty
}

[JsonConverter(typeof(NodeTypeConverter))]
public enum NodeType
{
    Block,
    Terminal,
    Connector,
}

public class CustomAttribute
{
    public required string Name { get; set; }
    public required string Value { get; set; }
}
